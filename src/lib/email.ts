
'use server';

import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

const isEmailConfigured = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM;

if (!isEmailConfigured && process.env.NODE_ENV === 'production') {
  console.error("CRITICAL: SMTP service is not configured in a production environment. Emails will not be sent.");
}

const transporter = isEmailConfigured ? nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT!, 10),
  secure: parseInt(SMTP_PORT!, 10) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
}) : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: true } | { success: false, error: string }> {
  // --- DEVELOPMENT ONLY ---
  // In development, log the email to the console instead of sending it.
  if (process.env.NODE_ENV === 'development') {
    console.log('--- DEVELOPMENT EMAIL ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('--- HTML Body ---');
    // A simple regex to extract the OTP from the HTML for easy access in the console.
    const otpMatch = html.match(/<h2.*?>(.*?)<\/h2>/);
    if (otpMatch) {
        console.log(`OTP: ${otpMatch[1]}`);
    } else {
        console.log(html);
    }
    console.log('-----------------------');
    return { success: true };
  }
  // --- END DEVELOPMENT ONLY ---

  if (!transporter) {
    const errorMsg = "Email service is not configured for production.";
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

    if (error.responseCode === 550 && error.response?.includes('Unusual sending activity')) {
        const userFriendlyError = 'Our email provider has temporarily limited sending. Please try again in a few minutes.';
        return { success: false, error: userFriendlyError };
    }
    
    return { success: false, error: 'Could not send the verification email at this time.' };
  }
}
