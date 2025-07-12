'use server';

import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  console.warn("SMTP service is not configured. Emails will not be sent. Please check your .env file.");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587', 10),
  secure: parseInt(SMTP_PORT || '587', 10) === 465, // true for 465, false for other ports (like 587)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!SMTP_HOST) {
    console.error("Email not sent: SMTP service is not configured.");
    // In a real app, you might want to avoid throwing here if email is non-critical,
    // but for auth flows, it's important.
    throw new Error("Email service is not available.");
  }
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    // In a production app, you might want to throw this error
    // or handle it more gracefully (e.g., add to a retry queue).
    throw new Error("Could not send email.");
  }
}
