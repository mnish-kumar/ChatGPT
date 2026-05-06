const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email server error:", error.message);
  } else {
    console.log("Email server is ready ✅");
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

/**
 * @param {*} email
 * @param {*} resetLink
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below:</p>
          <a href="${resetLink}" 
             style="
               background: #4F46E5; 
               color: white; 
               padding: 12px 24px; 
               border-radius: 6px; 
               text-decoration: none;
               display: inline-block;
               margin: 16px 0;
             ">
            Reset Password
          </a>
          <p>This link expires in <strong>15 minutes</strong>.</p>
          <p>If you didn't request this, ignore this email.</p>
          <hr/>
          <small>For security, never share this link with anyone.</small>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error; // ✅ controller will catch this
  }
};

// Send verification email with link to verify email address
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Thanks for signing up! Please verify your email by clicking below:</p>
          <a href="${verificationLink}"
             style="
               background: #4F46E5;
               color: white;
               padding: 12px 24px;
               border-radius: 6px;
               text-decoration: none;
               display: inline-block;
               margin: 16px 0;
             ">
            Verify Email
          </a>
          <p>This link expires in <strong>24 hours</strong>.</p>
          <p>If you didn't create an account, ignore this email.</p>
          <hr/>
          <small>Never share this link with anyone.</small>
        </div>
      `,
    });

    console.log("✅ Verification email sent to:", email);
  } catch (error) {
    console.error("❌ Verification email failed:", error.message);
    throw error;
  }
};

// Send welcome email after successful registration
const sendWelcomeEmail = async (email, firstname) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to " + process.env.APP_NAME + "! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome, ${firstname}! 👋</h2>
          <p>Your account has been created successfully.</p>
          <p>You're now on the <strong>FREE plan</strong>. Explore all features and upgrade anytime.</p>
          <hr/>
          <small>If you didn't create this account, please contact us immediately.</small>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Welcome email failed:", error.message);
    // Don't throw — welcome email failure shouldn't block registration
  }
};

// Send login alert email with IP and time details
const sendLoginAlertEmail = async (email, firstname, req) => {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "New Login Detected 🔐",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Login Alert</h2>
          <p>Hi ${firstname}, a new login was detected on your account.</p>
          <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px; background: #f3f4f6;"><strong>Time</strong></td>
              <td style="padding: 8px;">${time} (IST)</td>
            </tr>
            <tr>
              <td style="padding: 8px; background: #f3f4f6;"><strong>IP Address</strong></td>
              <td style="padding: 8px;">${ip}</td>
            </tr>
          </table>
          <p>If this was you, no action needed.</p>
          <p style="color: red;">If this wasn't you, <strong>change your password immediately.</strong></p>
          <hr/>
          <small>Never share your password with anyone.</small>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ Login alert failed:", error.message);
    // Don't throw — login alert failure shouldn't block login
  }
};

// Send plan upgrade email with payment details and validity
const sendPlanUpgradeEmail = async (email, firstname, planDetails) => {
  const { orderId, paymentId, startDate, expiry } = planDetails;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Premium!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You're now Premium! 🚀</h2>
          <p>Hi ${firstname}, your payment was successful and your plan has been upgraded.</p>

          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h3 style="margin: 0 0 12px;">📋 Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Plan</td>
                <td style="padding: 8px 0;"><strong>PREMIUM</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Start Date</td>
                <td style="padding: 8px 0;">${formatDate(startDate)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Valid Until</td>
                <td style="padding: 8px 0;">${formatDate(expiry)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order ID</td>
                <td style="padding: 8px 0; font-size: 12px;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Payment ID</td>
                <td style="padding: 8px 0; font-size: 12px;">${paymentId}</td>
              </tr>
            </table>
          </div>

          <p>Enjoy all premium features! If you have any issues, reply to this email.</p>
          <hr/>
          <small>Keep this email as your payment receipt.</small>
        </div>
      `,
    });
    console.log("✅ Plan upgrade email sent to:", email);
  } catch (error) {
    console.error("❌ Plan upgrade email failed:", error.message);
    // Non-blocking — payment already successful hai
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPlanUpgradeEmail,
  sendLoginAlertEmail,
};
