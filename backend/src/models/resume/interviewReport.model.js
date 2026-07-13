const mongoose = require("mongoose");

const technicalQuestionsSchema = new mongoose.Schema(
  {
    questions: {
      type: String,
      required: [true, "Technical question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer to the technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention behind the question is required"],
    },
  },
  { _id: false },
);

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    questions: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer to the behavioral question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention behind the question is required"],
    },
  },
  { _id: false },
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill name is required"],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: [true, "Severity level is required"],
    },
    recommendation: {
      type: String,
      required: [true, "Recommendation for the skill gap is required"],
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day number is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus area for the day is required"],
    },
    tasks: [
      {
        type: String,
        required: [true, "Task description is required"],
      },
    ],
  },
  { _id: false },
);

const atsScoreBreakdownSchema = new mongoose.Schema(
  {
    skillsMatch: { score: Number, max: { type: Number, default: 40 } },
    experienceMatch: { score: Number, max: { type: Number, default: 25 } },
    projectsMatch: { score: Number, max: { type: Number, default: 20 } },
    keywordsMatch: { score: Number, max: { type: Number, default: 10 } },
    education: { score: Number, max: { type: Number, default: 5 } },
  },
  { _id: false },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    atsScore: {
      total: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, "Total ATS score is required"],
      },
      breakdown: atsScoreBreakdownSchema,
      formattingScore: {
        score: { type: Number, default: 0 },
        max: { type: Number, default: 10 },
        issues: [{
          issue: String,
          severity: {
            type: String,
            enum: ["Low", "Medium", "High"],
          }
        }],
      },
      tier: {
        type: String,
        enum: ["Poor", "Average", "Good", "Excellent"],
        required: true,
      },
      missingKeywords: [{
        keyword: String,
        suggestion: String,
        type: {
          type: String,
          enum: ["genuinely_missing", "present_but_unwritten", "weak_mention"],
        }
      }],
      strengths: [String],
      version: { type: Number, default: 1 },
      previousVersions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport",
        default: null,
      },
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true },
);

const interviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

module.exports = interviewReportModel;
