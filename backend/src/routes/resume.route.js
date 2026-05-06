const express = require("express");
const router = express.Router();
const resumeController = require("../controller/resumeAnalyzer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

/**
 * @desc Analyze the uploaded resume and generate an interview report, learning resources, and job suggestions.
 * @route POST /api/resume/analysis
 * @access Private
 * @body { file: resume (PDF), jobDescription: string, selfDescription: string }
 * @returns { interviewReport: { matchScore: number, skillGaps: array, ... }, learningResources: array, jobSuggestions: array }
 */
router.post(
  "/analysis",
  authMiddleware.createAuthMiddleware(),
  upload.single("resume"),
  resumeController.analyzeResume,
);

/**
 * @desc Get the history of analyzed resumes and their reports for the authenticated user.
 * @route GET /api/resume/history
 * @access Private
 * @returns { resumes: array of { resumeContent: string, jobDescription: string, selfDescription: string, interviewReport: object, createdAt: date } }
 * @description This endpoint allows users to retrieve a history of their analyzed resumes along with the corresponding interview reports. Each entry in the history includes the content of the resume, the job description provided, the self-description, the generated interview report, and the date when the analysis was performed.
 * This feature is useful for users to track their progress over time, review past analyses, and identify areas for improvement based on the feedback provided in the interview reports.
 *  @note The response includes an array of resume analysis entries, each containing detailed information about the resume and the associated interview report. This allows users to easily access and review their past analyses.
 * @note The endpoint is protected by authentication middleware, ensuring that only authenticated users can access their resume history.
 */
router.get(
  "/history",
  authMiddleware.createAuthMiddleware(),
  resumeController.getResumeHistory,
);

module.exports = router;
