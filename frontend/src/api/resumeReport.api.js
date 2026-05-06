import api from "../api/axios";

export const generateResumeReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription ?? "");
    formData.append("selfDescription", selfDescription ?? "");
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await api.post("/api/resume/analysis", formData, {});
    const data = response.data;

    return {
      ...data.interviewReport,
      jobSuggestions: data.jobSuggestions?.jobs ?? [],
      learningResources: data.learningResources?.resources ?? [],
    };
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Resume analysis failed";
    const wrapped = new Error(message);
    wrapped.cause = error;
    throw wrapped;
  }
};

export const getResumeHistory = async () => {
  const response = await api.get("/api/resume/history");
  return response.data?.reports ?? [];
};
