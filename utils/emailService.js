const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;

async function sendEmail(to, subject, htmlContent) {
  const msg = { to, from: FROM_EMAIL, subject, html: htmlContent };
  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error.message);
  }
}

async function sendSignupEmail(to, name) {
  const subject = "🎉 Welcome to MomntumAI!";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hi ${name},</h2>
      <p>Welcome to <b>MomntumAI</b> 🚀</p>
      <p>We’re excited to have you onboard!</p>
      <p style="margin-top:20px;">Cheers,<br>Team MomntumAI</p>
    </div>
  `;
  await sendEmail(to, subject, htmlContent);
}

module.exports = { sendSignupEmail };
