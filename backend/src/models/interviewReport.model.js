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

const interviewReportSchema = new mongoose.Schema({
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
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalQuestionsSchema],
  behavioralQuestions: [behavioralQuestionsSchema],
  skillGaps: [skillGapsSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
});

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;
