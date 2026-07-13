const sendEmail = require("./brevo.transport");

const APP_NAME = process.env.APP_NAME || "JarviSync";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@jarvisync.com";
const APP_URL = process.env.APP_URL;
const CURRENT_YEAR = new Date().getFullYear();

// Welcome Email
const sendWelcomeEmail = async (email, firstname) => {
  try {
    await sendEmail({
      to: email,
      subject: `Welcome to ${APP_NAME} — your account is ready`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to ${APP_NAME}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

        <!-- Preheader (hidden preview text) -->
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          Your ${APP_NAME} account has been created successfully. Welcome aboard, ${firstname}!
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 0;">
          <tr>
            <td align="center">

              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#4285F4;padding:28px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left" style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                          ${APP_NAME}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#1a1a1a;">
                      Welcome aboard, ${firstname}
                    </h1>
                    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#4a4a4a;">
                      Your ${APP_NAME} account has been created successfully. We're glad to have you here.
                    </p>
                    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#4a4a4a;">
                      You're currently on the <strong style="color:#1a1a1a;">Free plan</strong>. You can explore all core features right away, and upgrade whenever you're ready for more.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:6px;background-color:#4285F4;">
                          <a href="${process.env.APP_URL || "#"}"
                             style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
                            Go to Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:32px 0 0 0;font-size:13px;line-height:1.6;color:#8a8a8a;">
                      Didn't create this account? Please contact us immediately at
                      <a href="mailto:${SUPPORT_EMAIL}" style="color:#4285F4;text-decoration:none;">${SUPPORT_EMAIL}</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #eeeeee;">
                    <p style="margin:0 0 4px 0;font-size:12px;color:#9a9a9a;">
                      Need help? Reach us at
                      <a href="mailto:${SUPPORT_EMAIL}" style="color:#4285F4;text-decoration:none;">${SUPPORT_EMAIL}</a>
                    </p>
                    <p style="margin:0;font-size:12px;color:#b0b0b0;">
                      © ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
    });
  } catch (err) {
    console.error("Welcome email failed:", err.message);
  }
};

// Login Alert Email
const sendLoginAlertEmail = async (email, firstname, meta = {}) => {
  const ip = meta?.ip || "Unknown";
  const userAgent = meta?.userAgent || "Unknown";
  const time = meta?.time
    ? new Date(meta.time).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  try {
    await sendEmail({
      to: email,
      subject: `New login to your ${APP_NAME} account`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Login Detected</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

        <!-- Preheader -->
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          A new login to your ${APP_NAME} account was detected at ${time} IST.
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 0;">
          <tr>
            <td align="center">

              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background-color:#4285F4;padding:28px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left" style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                          ${APP_NAME}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:600;color:#1a1a1a;">
                      New login detected
                    </h1>
                    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#4a4a4a;">
                      Hi ${firstname}, we noticed a new login to your ${APP_NAME} account. Here are the details:
                    </p>

                    <!-- Details table -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin-bottom:24px;">
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9fafb;font-size:13px;font-weight:600;color:#6a6a6a;width:35%;border-bottom:1px solid #eeeeee;">Time</td>
                        <td style="padding:12px 16px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eeeeee;">${time} (IST)</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9fafb;font-size:13px;font-weight:600;color:#6a6a6a;border-bottom:1px solid #eeeeee;">IP Address</td>
                        <td style="padding:12px 16px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #eeeeee;">${ip}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9fafb;font-size:13px;font-weight:600;color:#6a6a6a;">Device</td>
                        <td style="padding:12px 16px;font-size:13px;color:#1a1a1a;">${userAgent}</td>
                      </tr>
                    </table>

                    <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#4a4a4a;">
                      If this was you, no action is needed.
                    </p>

                    <!-- Warning box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2;border-left:3px solid #dc2626;border-radius:4px;margin-bottom:8px;">
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0;font-size:14px;line-height:1.6;color:#991b1b;">
                            <strong>Wasn't you?</strong> Change your password immediately and contact support at
                            <a href="mailto:${SUPPORT_EMAIL}" style="color:#991b1b;text-decoration:underline;">${SUPPORT_EMAIL}</a>.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #eeeeee;">
                    <p style="margin:0 0 4px 0;font-size:12px;color:#9a9a9a;">
                      Need help? Reach us at
                      <a href="mailto:${SUPPORT_EMAIL}" style="color:#4285F4;text-decoration:none;">${SUPPORT_EMAIL}</a>
                    </p>
                    <p style="margin:0;font-size:12px;color:#b0b0b0;">
                      © ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`,
    });
  } catch (err) {
    console.error("Login alert failed:", err.message);
  }
};

// Password Reset Email
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

// Email Verification Email
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

// Plan Upgrade Confirmation Email
const sendPlanUpgradeEmail = async (email, firstname, planDetails) => {
  const { orderId, paymentId, startDate, expiry } = planDetails;
  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
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

// Expiry Reminder (3 days before expiry)
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

// Plan Expired Email
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

const sendUpgradeNudgeEmail = async (email, firstname) => {
  try {
    await sendEmail({
      to: email,
      subject: `${firstname}, unlock more with ${APP_NAME} Premium`,
      html: `<p>Hi ${firstname}, hope you're enjoying ${APP_NAME}! Upgrade to Premium to unlock advanced features.</p>`,
    });
  } catch (err) {
    console.error("Upgrade nudge email failed:", err.message);
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
  sendUpgradeNudgeEmail,
};
