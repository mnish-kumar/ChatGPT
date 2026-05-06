const axios = require("axios");
const JobSuggestion = require("../models/jobSuggestion.model");

const searchJobListings = async ({ userId, reportId, jobRole, matchScore }) => {
  try {
    // Cache check
    const cached = await JobSuggestion.findOne({
      user: userId,
      interviewReport: reportId,
    });
    if (cached) return cached;

    const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: `${jobRole} jobs in India`,
        date_posted: "month",
        country: "India",
        num_pages: 1,
        page: 1,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    const rawJobs = response.data?.data;
    const jobs = Array.isArray(rawJobs)
      ? rawJobs.map((job) => ({
          title: job.job_title,
          company: job.employer_name,
          location: job.job_location ?? "Remote",
          isRemote: job.job_is_remote ?? false,
          employmentType: job.job_employment_type ?? "FULLTIME",
          postedAt: job.job_posted_at_datetime_utc
            ? new Date(job.job_posted_at_datetime_utc)
            : new Date(),
          applyUrl: job.job_apply_link,
          description: job.job_description?.slice(0, 200) ?? "",
          logo: job.employer_logo ?? null,
          salary: job.job_salary_string ?? null,
          publisher: job.job_publisher ?? null,
        }))
      : [];

    const saved = await JobSuggestion.create({
      user: userId,
      interviewReport: reportId,
      matchScore,
      jobRole,
      jobs,
    });

    return saved;
  } catch (error) {
    console.error("JSearch error:", error.message);
    throw new Error("Failed to fetch job listings");
  }
};

module.exports = searchJobListings;
