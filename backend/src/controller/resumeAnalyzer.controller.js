const interviewReportModel = require("../models/interviewReport.model");
const pdfParse = require("pdf-parse");
const aiService = require("../services/ai.service");
const searchLearningResources = require("../services/tavily.service");
const jobSearchService = require("../services/jobSearch.service");
const extractJobRole = require("../utils/jobRole");
const searchJobListings = require("../services/jobSearch.service");

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

module.exports = {
  analyzeResume,
};
