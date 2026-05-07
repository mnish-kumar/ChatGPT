const { Queue, Worker } = require("bullmq");
const emailService = require("./email.worker");
const { bullMQRedis } = require("../config/redis");

const QUEUE_NAME = "email";

const emailQueue = new Queue(QUEUE_NAME, {
  connection: bullMQRedis,
  sharedConnection: true,
  skipVersionCheck: true,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

emailQueue.on("error", (err) => {
  console.error("Email Queue Error❌", err);
});

emailQueue.on("waiting", (jobId) => {
  console.log(`Email job waiting: ${jobId}`);
});

emailQueue.waitUntilReady().then(() => {
  console.log("BullMQ Email Queue ready ✅");
});

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
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    console.log(`✅ Email sent [${normalizedType}] → ${email}`);
  },
  {
    connection: bullMQRedis,
    sharedConnection: true,
    skipVersionCheck: true,
  },
);

emailWorker.on("failed", (job, err) => {
  console.error(
    `❌ Email job failed [${job.data.type}] → ${job.data.email}:`,
    err.message,
  );
});

emailWorker.on("ready", () => {
  console.log("Email worker is ready✅");
});

module.exports = { emailQueue };
