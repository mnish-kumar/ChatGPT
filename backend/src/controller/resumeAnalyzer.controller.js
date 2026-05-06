const interviewReportModel = require("../models/interviewReport.model");
const JobSuggestion = require("../models/jobSuggestion.model");
const learningResourcesModel = require("../models/LearningResources.model");
const pdfParse = require("pdf-parse");
const aiService = require("../services/ai.service");
const searchLearningResources = require("../services/tavily.service");
const jobSearchService = require("../services/jobSearch.service");
const extractJobRole = require("../utils/jobRole");
const searchJobListings = require("../services/jobSearch.service");

/**
 * @desc Analyze the uploaded resume and generate an interview report, learning resources, and job suggestions.
 * @route POST /api/resume/analysis
 * @access Private
 */
async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required." });
    }

    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { jobDescription, selfDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ error: "Job description are required." });
    }

    if (!selfDescription) {
      return res.status(400).json({
        error: "Either self description is required.",
      });
    }

    const interviewReportByAI = await aiService.generateInterviewReport({
      selfDescription,
      jobDescription,
      resume: resumeContent.text,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      ...interviewReportByAI,
    });

    // if user matchScore < 80, toh learning resources fetch
    let learningResources = null;
    let jobSuggestions = null;

    if (interviewReport.matchScore < 80) {
      learningResources = await searchLearningResources({
        skillGaps: interviewReport.skillGaps,
        userId: req.user.id,
        reportId: interviewReport._id,
        matchScore: interviewReport.matchScore,
      });
    } else {
      jobSuggestions = await searchJobListings({
        userId: req.user.id,
        reportId: interviewReport._id,
        matchScore: interviewReport.matchScore,
        jobRole: extractJobRole(interviewReport.jobDescription),
      });
    }

    res.status(200).json({
      message: "Resume analyzed successfully",
      interviewReport,
      learningResources: learningResources,
      jobSuggestions: jobSuggestions,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing the resume." });
  }
}

async function getResumeHistory(req, res) {
  try {
    const userId = req.user._id;
    const reports = await interviewReportModel
      .find({ user: userId })
      .select(
        "jobDescription matchScore skillGaps technicalQuestions behavioralQuestions preparationPlan createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const reportIds = reports.map((r) => r._id);

    const [jobSuggestionDocs, learningResourceDocs] = await Promise.all([
      JobSuggestion.find({ user: userId, interviewReport: { $in: reportIds } })
        .select("interviewReport jobs")
        .lean(),
      learningResourcesModel
        .find({ user: userId, interviewReport: { $in: reportIds } })
        .select("interviewReport resources")
        .lean(),
    ]);

    const jobsByReportId = Object.fromEntries(
      jobSuggestionDocs.map((d) => [String(d.interviewReport), d.jobs ?? []]),
    );
    const resourcesByReportId = Object.fromEntries(
      learningResourceDocs.map((d) => [String(d.interviewReport), d.resources ?? []]),
    );

    const enrichedReports = reports.map((r) => ({
      ...r,
      jobSuggestions: jobsByReportId[String(r._id)] ?? [],
      learningResources: resourcesByReportId[String(r._id)] ?? [],
    }));

    res
      .status(200)
      .json({
        message: "Resume history fetched successfully",
        reports: enrichedReports,
      });
  } catch (error) {
    console.error("Error fetching resume history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching resume history." });
  }
}

module.exports = {
  analyzeResume,
  getResumeHistory,
};
