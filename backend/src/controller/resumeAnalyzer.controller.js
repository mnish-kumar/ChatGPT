const interviewReportModel = require("../models/interviewReport.model");
const pdfParse = require("pdf-parse");
const aiService = require("../services/ai.service");

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

    res.status(200).json({
      message: "Resume analyzed successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing the resume." });
  }
}

module.exports = {
  analyzeResume,
};
