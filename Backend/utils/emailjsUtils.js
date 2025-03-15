const emailjs = require("@emailjs/nodejs");
require("dotenv").config(); // Load environment variables

const sendEmail = async (to, subject, body) => {
  try {
    const templateParams = {
      from_name: "FL Insurance Hub",
      to_email: to, // Recipient email
      subject: subject,
      body: body,
      name: "FL Insurance Hub",
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID, // Service ID
      process.env.EMAILJS_TEMPLATE_ID, // Template ID
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY, // Public API Key
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Private API Key (recommended for security)
      }
    );

    console.log(
      `Email sent to ${to} with response:`,
      response.status,
      response.text
    );
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return false;
  }
};

module.exports = sendEmail;
