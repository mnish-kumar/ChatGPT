const mongoose = require("mongoose");

const jobItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "Remote" },
    isRemote: { type: Boolean, default: false },
    employmentType: { type: String, default: "FULLTIME" },
    postedAt: { type: Date, default: Date.now },
    applyUrl: { type: String, required: true },
    description: { type: String, default: "" },
    logo: { type: String, default: null },
  },
  { _id: false }
);

const jobSuggestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    interviewReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport",
      required: true,
      index: true,
    },
    matchScore: { type: Number, required: true },
    jobRole: { type: String, required: true },
    jobs: [jobItemSchema],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hrs TTL
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSuggestion", jobSuggestionSchema);