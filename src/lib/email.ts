'use server';

import nodemailer from 'nodemailer';

const { ZOHO_MAIL_USER, ZOHO_MAIL_PASSWORD, ZOHO_MAIL_FROM } = process.env;

if (!ZOHO_MAIL_USER || !ZOHO_MAIL_PASSWORD || !ZOHO_MAIL_FROM) {
  console.warn("Email service is not configured. Emails will not be sent. Please check your .env file.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: ZOHO_MAIL_USER,
    pass: ZOHO_MAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!transporter.options.auth.user || !transporter.options.auth.pass) {
    // Prevent sending emails if credentials are not set
    return;
  }
  
  try {
    const info = await transporter.sendMail({
      from: ZOHO_MAIL_FROM,
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
