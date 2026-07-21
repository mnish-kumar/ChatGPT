const { Queue } = require("bullmq");
const { bullMQRedis } = require("../config/redis");
const logger = require("../config/logger")

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
  logger.error("Email Queue Error:", err);
});

emailQueue.on("waiting", (jobId) => {
  logger.info(`Email job waiting: ${jobId}`);
});

emailQueue.waitUntilReady().then(() => {
  logger.info("BullMQ Email Queue ready");
});

module.exports = { emailQueue, QUEUE_NAME };
