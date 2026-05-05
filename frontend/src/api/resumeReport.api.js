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

        const response = await api.post("/api/resume/analysis", formData, {
        });
        return response.data?.interviewReport ?? response.data;
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