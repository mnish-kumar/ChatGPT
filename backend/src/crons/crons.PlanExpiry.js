const cron = require("node-cron");
const userModel = require("../models/user.model");
const { emailQueue } = require("../broker/email.queue");

cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Checking expired plans...");

  try {
    // Expiry reminder — 3 day before expiry
    const soonToExpire = await userModel.find({
      "plan.type": "PREMIUM",
      "plan.expiry": {
        $gte: new Date(),
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });

    for (const user of soonToExpire) {
      await emailQueue.add("EXPIRY_REMINDER", { 
        type: "EXPIRY_REMINDER",
        email: user.email,
        firstname: user.fullname.firstname,
        expiry: user.plan.expiry,
      });
    }

    // Expired users
    const expiredUsers = await userModel.find({
      "plan.type": "PREMIUM",
      "plan.expiry": { $lt: new Date() },
    });

    for (const user of expiredUsers) {
      await emailQueue.add("PLAN_EXPIRED", {
        type: "PLAN_EXPIRED",
        email: user.email,
        firstname: user.fullname.firstname,
      });
    }

    // Bulk downgrade
    await userModel.updateMany(
      { "plan.type": "PREMIUM", "plan.expiry": { $lt: new Date() } },
      { $set: { "plan.type": "FREE", "plan.expiry": null, "plan.payment": null } }
    );

  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }
}, { timezone: "Asia/Kolkata" });