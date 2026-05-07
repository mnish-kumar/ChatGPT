const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await transactionalApi.sendTransacEmail({
      sender: {
        name: process.env.APP_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error(
      "Brevo email error ❌",
      error.response?.body || error
    );
  }
};



// ─── Welcome Email
const sendWelcomeEmail = async (email, firstname) => {
  try {
    await sendEmail({
      to: email,
      subject: `Welcome to ${process.env.APP_NAME}! 🎉`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Welcome, ${firstname}! 👋</h2>
          <p>Your account has been created successfully.</p>
          <p>You're now on the <strong>FREE plan</strong>. Explore all features and upgrade anytime.</p>
          <hr/>
          <small>If you didn't create this account, please contact us immediately.</small>
        </div>`,
    });
  } catch (err) {
    console.error("❌ Welcome email failed:", err.message);
    // Non-blocking — registration block nahi hogi
  }
};

// ─── Password Reset Email
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="background:#4F46E5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0;">
            Reset Password
          </a>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
          <hr/>
          <small>Never share this link with anyone.</small>
        </div>`,
    });
  } catch (err) {
    console.error("❌ Password reset email failed:", err.message);
    throw err; // controller will catch
  }
};

// ─── Email Verification Email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thanks for signing up! Please verify your email:</p>
          <a href="${verificationLink}" style="background:#4F46E5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin:16px 0;">
            Verify Email
          </a>
          <p>This link expires in <strong>24 hours</strong>.</p>
          <hr/>
          <small>Never share this link with anyone.</small>
        </div>`,
    });
    console.log("✅ Verification email sent to:", email);
  } catch (err) {
    console.error("❌ Verification email failed:", err.message);
    throw err;
  }
};

// ─── Login Alert Email
const sendLoginAlertEmail = async (email, firstname, meta = {}) => {
  const ip = meta?.ip || "Unknown";
  const userAgent = meta?.userAgent || "Unknown";
  const time = meta?.time
    ? new Date(meta.time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  try {
    await sendEmail({
      to: email,
      subject: "New Login Detected 🔐",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Login Alert</h2>
          <p>Hi ${firstname}, a new login was detected.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;background:#f3f4f6;"><strong>Time</strong></td><td style="padding:8px;">${time} (IST)</td></tr>
            <tr><td style="padding:8px;background:#f3f4f6;"><strong>IP</strong></td><td style="padding:8px;">${ip}</td></tr>
            <tr><td style="padding:8px;background:#f3f4f6;"><strong>Device</strong></td><td style="padding:8px;">${userAgent}</td></tr>
          </table>
          <p>If this was you, no action needed.</p>
          <p style="color:red;">If this wasn't you, <strong>change your password immediately.</strong></p>
        </div>`,
    });
  } catch (err) {
    console.error("❌ Login alert failed:", err.message);
    // Non-blocking
  }
};

// ─── Plan Upgrade Confirmation Email
const sendPlanUpgradeEmail = async (email, firstname, planDetails) => {
  const { orderId, paymentId, startDate, expiry } = planDetails;
  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  });

  try {
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Premium!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>You're now Premium! 🚀</h2>
          <p>Hi ${firstname}, your payment was successful.</p>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;">Plan</td><td><strong>PREMIUM</strong></td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Start Date</td><td>${fmt(startDate)}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Valid Until</td><td>${fmt(expiry)}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Order ID</td><td style="font-size:12px;">${orderId}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Payment ID</td><td style="font-size:12px;">${paymentId}</td></tr>
            </table>
          </div>
          <hr/><small>Keep this email as your receipt.</small>
        </div>`,
    });
    console.log("✅ Plan upgrade email sent to:", email);
  } catch (err) {
    console.error("❌ Plan upgrade email failed:", err.message);
    // Non-blocking — payment already successful
  }
};

// ─── Expiry Reminder (3 days before expiry)
const sendExpiryReminderEmail = async (email, firstname, expiryDate) => {
  try {
    await sendEmail({
      to: email,
      subject: `Your ${process.env.APP_NAME} Premium expires soon ⚠️`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Hi ${firstname},</h2>
          <p>Your <strong>Premium plan</strong> expires on <strong>${new Date(expiryDate).toDateString()}</strong>.</p>
          <a href="${process.env.FRONTEND_URL}/upgrade" style="background:#6366f1;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
            Renew Premium
          </a>
        </div>`,
    });
  } catch (err) {
    console.error("❌ Expiry reminder email failed:", err.message);
  }
};

// ─── Plan Expired Email
const sendPlanExpiredEmail = async (email, firstname) => {
  try {
    await sendEmail({
      to: email,
      subject: `Your ${process.env.APP_NAME} Premium has expired`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2>Hi ${firstname},</h2>
          <p>Your <strong>Premium plan has expired</strong>. You've been moved to the Free plan.</p>
          <a href="${process.env.FRONTEND_URL}/upgrade" style="background:#6366f1;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
            Upgrade Again
          </a>
        </div>`,
    });
  } catch (err) {
    console.error("❌ Plan expired email failed:", err.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendLoginAlertEmail,
  sendPlanUpgradeEmail,
  sendExpiryReminderEmail,
  sendPlanExpiredEmail, 
};