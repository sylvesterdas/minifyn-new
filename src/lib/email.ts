
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

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: true } | { success: false, error: string }> {
  if (!SMTP_HOST) {
    const errorMsg = "Email service is not configured.";
    console.error(`Email not sent: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true };

  } catch (error: any) {
    console.error("Error sending email:", error);

    // Check for specific SMTP rate limit/spam error code
    if (error.responseCode === 550 && error.response?.includes('Unusual sending activity')) {
        const userFriendlyError = 'Our email provider has temporarily limited sending. Please try again in a few minutes.';
        return { success: false, error: userFriendlyError };
    }
    
    // For other errors, return a generic message
    return { success: false, error: 'Could not send the verification email at this time.' };
  }
}
