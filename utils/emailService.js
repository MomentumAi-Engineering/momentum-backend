const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSignupEmail = async (to, name) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject: 'Welcome to MomntumAi!',
    html: `
      <h2>Hello ${name},</h2>
      <p>🎉 Welcome to <strong>MomntumAi</strong>! We’re excited to have you on board.</p>
      <p>Let us know if you need anything.</p>
      <br>
      <p>🚀 The MomntumAi Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Signup email sent to:', to);
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
};

module.exports = { sendSignupEmail };
