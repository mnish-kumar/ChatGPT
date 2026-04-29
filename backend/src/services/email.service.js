const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
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

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
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

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail
};
