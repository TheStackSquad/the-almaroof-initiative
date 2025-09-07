// src/lib/nodemailer.js

// Import the nodemailer library
import nodemailer from "nodemailer";

// Set up the transporter using environment variables for security
// Ensure GMAIL_USER and GMAIL_APP_PASSWORD are set in your .env.local file.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender address (your Gmail)
    to: to, // Recipient address
    subject: subject, // Subject line
    html: html, // HTML content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    // Log additional details for debugging
    if (error.response) {
      console.error("Server response:", error.response);
    }
    return { success: false, error: error.message };
  }
}

module.exports = { sendMail };
