const { Worker } = require("bullmq");
const { bullMQRedis } = require("../config/redis");
const { QUEUE_NAME } = require("../broker/email.queue");
const emailService = require("../services/email.service");
const userModel = require("../models/user/user.model");

const emailWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const {
      type,
      email,
      firstname,
      expiry,
      orderId,
      paymentId,
      startDate,
      resetLink,
      verificationLink,
      meta,
    } = job.data || {};

    const rawType = type || job?.name || "";

    const normalizedType = String(rawType)
      .trim()
      .toUpperCase()
      .replace(/[.\-\s]/g, "_");

    switch (normalizedType) {
      case "WELCOME":
        await emailService.sendWelcomeEmail(email, firstname);
        break;

      case "LOGIN":
        await emailService.sendLoginAlertEmail(email, firstname, meta);
        break;

      case "PASSWORD_RESET":
        await emailService.sendPasswordResetEmail(email, resetLink);
        break;

      case "EMAIL_VERIFICATION":
      case "VERIFICATION_EMAIL":
        await emailService.sendVerificationEmail(email, verificationLink);
        break;

      case "EXPIRY_REMINDER":
        await emailService.sendExpiryReminderEmail(email, firstname, expiry);
        break;

      case "PLAN_EXPIRED":
        await emailService.sendPlanExpiredEmail(email, firstname);
        break;

      case "PLAN_UPGRADE":
        await emailService.sendPlanUpgradeEmail(email, firstname, {
          orderId,
          paymentId,
          startDate,
          expiry,
        });

      case "UPGRADE_NUDGE":
        {
          const currentUser = await userModel
            .findById(job.data.userId)
            .select("plan.type");
          if (currentUser && currentUser.plan.type === "FREE") {
            await emailService.sendUpgradeNudgeEmail(email, firstname);
          } else {
            console.log(
              `Skipping upgrade nudge — user ${email} already upgraded`,
            );
          }
          break;
        }
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }
  },
  {
    connection: bullMQRedis,
    sharedConnection: true,
    skipVersionCheck: true,
  },
);

emailWorker.on("failed", (job, err) => {
  console.error(
    `Email job failed [${job.data.type}] -> ${job.data.email}:`,
    err.message,
  );
});
 
emailWorker.on("ready", () => {
  console.log("Email worker is ready");
});

module.exports = emailWorker;
