const mongoose = require("mongoose");

const resourceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Invalid URL format"],
    },
    description: { type: String, default: "" },
    source: { type: String, default: "" },
    thumbnail: { type: String, default: null },
  },
  { _id: false },
);

const skillResourceSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
    documentation: [resourceItemSchema],
    videos: [resourceItemSchema],
  },
  { _id: false },
);

const learningResourceSchema = new mongoose.Schema(
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
      enum: ["Poor", "Average", "Good", "Excellent"],
      required: true,
    },
    resources: [skillResourceSchema],
    fetchedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true },
);


learningResourceSchema.index({ user: 1, interviewReport: 1 });

const learningResourcesModel = mongoose.model(
  "LearningResources",
  learningResourceSchema,
);

module.exports = learningResourcesModel;
