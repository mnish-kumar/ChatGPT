// crons/planExpiry.cron.js
const cron = require('node-cron');
const userModel = require('../models/user.model');
const emailService = require('../services/email.service');


cron.schedule('0 0 * * *', async () => {
  console.log("🔄 Checking expired plans...");

  try {
    // ✅ Expire hone wale users — 3 din pehle reminder
    const soonToExpire = await userModel.find({
      'plan.type': 'PREMIUM',
      'plan.expiry': {
        $gte: new Date(),
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // agle 3 din
      },
    });

    for (const user of soonToExpire) {
      emailService.sendPlanExpiryReminderEmail(user.email, user.fullname.firstname, user.plan.expiry);
    }

    // Already expire users
    const expiredUsers = await userModel.find({
      'plan.type': 'PREMIUM',
      'plan.expiry': { $lt: new Date() },
    });

    for (const user of expiredUsers) {
      emailService.sendPlanExpiredEmail(user.email, user.fullname.firstname);
    }

    // Bulk reset
    const result = await userModel.updateMany(
      {
        'plan.type': 'PREMIUM',
        'plan.expiry': { $lt: new Date() },
      },
      {
        $set: {
          'plan.type': 'FREE',
          'plan.expiry': null,
          'plan.payment': null,
        },
      },
    );

  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }
}, {
  timezone: "Asia/Kolkata"
});