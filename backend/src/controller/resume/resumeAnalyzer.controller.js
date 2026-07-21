const interviewReportModel = require("../../models/resume/interviewReport.model");
const JobSuggestion = require("../../models/resume/jobSuggestion.model");
const learningResourcesModel = require("../../models/resume/LearningResources.model");
const pdfParse = require("pdf-parse");
const aiService = require("../../services/resume/resumeAnalyze.service");
const searchLearningResources = require("../../services/resume/tavily.service");
const extractJobRole = require("../../utils/jobRole");
const searchJobListings = require("../../services/resume/jobSearch.service");
const checkFormatting = require("../../utils/checkFormatting");
const calculateAtsScore = require("../../utils/calculateAtsScore");
const logger = require("../../config/logger");

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

    // Step A: Extract structured data from resume and job description
    const extractedData = await aiService.extractResumeData({
      selfDescription,
      jobDescription,
      resume: resumeContent.text,
    });

    // Step B: Rule-based formatting check
    const formattingResult = checkFormatting(resumeContent);

    // Step C: Backend formula se score
    const atsScore = calculateAtsScore(extractedData, formattingResult);

    // Step D: If is tier "Poor" then tech/behavioral questions not generate
    let interviewData = {
      technicalQuestions: [],
      behavioralQuestions: [],
      skillGaps: [],
      preparationPlan: [],
    };

    if (atsScore.tier !== "Poor") {
      interviewData = await aiService.generateInterviewReport({
        selfDescription,
        jobDescription,
        resume: resumeContent.text,
      });
    }

    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      atsScore,
      ...interviewData,
    });

    // Step E: Tier-based unlock logic
    let learningResources = null;
    let jobSuggestions = null;

    try {
      if (atsScore.tier === "Average") {
        learningResources = await searchLearningResources({
          skillGaps: interviewReport.skillGaps,
          userId: req.user._id,
          reportId: interviewReport._id,
          atsScoreTotal: atsScore.total,
          tier: atsScore.tier,
        });
      }
    } catch (error) {
      logger.error("Learning resources search failed:", error.message);
      learningResources = [];
    }

    try {
      if (atsScore.tier === "Good" || atsScore.tier === "Excellent") {
        jobSuggestions = await searchJobListings({
          userId: req.user._id,
          reportId: interviewReport._id,
          jobRole: extractJobRole(jobDescription),
          atsScoreTotal: atsScore.total,
          tier: atsScore.tier,
        });
      }
    } catch (error) {
      logger.error("Job search failed:", error.message);
      jobSuggestions = [];
    }

    res.status(200).json({
      message: "Resume analyzed successfully",
      interviewReport,
      learningResources,
      jobSuggestions,
    });
  } catch (error) {
    logger.error("Error analyzing resume:", error);
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
        "jobDescription atsScore skillGaps technicalQuestions behavioralQuestions preparationPlan missingKeywords strengths version createdAt",
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
      learningResourceDocs.map((d) => [
        String(d.interviewReport),
        d.resources ?? [],
      ]),
    );

    const enrichedReports = reports.map((r) => ({
      ...r,
      jobSuggestions: jobsByReportId[String(r._id)] ?? [],
      learningResources: resourcesByReportId[String(r._id)] ?? [],
    }));

    res.status(200).json({
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
