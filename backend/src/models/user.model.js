const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["FREE", "PREMIUM"],
      default: "FREE",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiry: {
      type: Date,
    },
    payment: {
      orderId: String,
      paymentId: String,
      signature: String,
    },

    razorpaySubscriptionId: {
      type: String,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      default: null, // null for normal users
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    plan: [planSchema],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,

    twoFactorAuth: {
      enabled: {
        type: Boolean,
        default: false,
      },
      secret: {
        type: String,
        default: null, // ← TOTP secret
      },
      backupCodes: {
        type: [String],
        default: [], // ← recovery codes
      },
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
