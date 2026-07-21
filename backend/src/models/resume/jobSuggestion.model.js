const mongoose = require("mongoose");

const jobItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "Remote" },
    isRemote: { type: Boolean, default: false },
    employmentType: { type: String, default: "FULLTIME" },
    postedAt: { type: Date, default: null },
    applyUrl: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Invalid URL format"],
    },
    description: { type: String, default: "" },
    logo: { type: String, default: null },
    salary: { type: String, default: null },
    publisher: { type: String, default: null },
  },
  { _id: false },
);

const jobSuggestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    interviewReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport",
      required: true,
    },
    atsScoreTotal: { type: Number, required: true },   
    tier: {                                             
      type: String,
      enum: ["Good", "Excellent"], 
      required: true,
    },
    jobRole: { type: String, required: true },
    jobs: [jobItemSchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true },
);


jobSuggestionSchema.index({ user: 1, interviewReport: 1 });

module.exports = mongoose.model("JobSuggestion", jobSuggestionSchema);