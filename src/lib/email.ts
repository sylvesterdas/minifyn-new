"use server";

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
} = process.env;

const isProduction = process.env.NODE_ENV === "production";

const isProdEmailConfigured =
  SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM;
const isDevEmailConfigured =
  MAILTRAP_HOST && MAILTRAP_PORT && MAILTRAP_USER && MAILTRAP_PASS;

let transporter: nodemailer.Transporter | null = null;

if (isProduction) {
  if (isProdEmailConfigured) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT!, 10),
      secure: parseInt(SMTP_PORT!, 10) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  } else {
    console.error(
      "CRITICAL: SMTP service is not configured in a production environment. Emails will not be sent."
    );
  }
} else {
  // Development environment
  if (isDevEmailConfigured) {
    transporter = nodemailer.createTransport({
      host: MAILTRAP_HOST,
      port: parseInt(MAILTRAP_PORT!, 10),
      auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS,
      },
    });
    console.log("Using Mailtrap for development email sending.");
  } else {
    console.log(
      "Mailtrap not configured. Email sending will be logged to the console."
    );
  }
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<
  { success: true } | { success: false; error: string }
> {
  // --- DEVELOPMENT CONSOLE FALLBACK ---
  // If in development and no transporter is configured (i.e., Mailtrap vars are missing),
  // log the email to the console instead of sending it.
  if (!isProduction && !transporter) {
    console.log("--- DEVELOPMENT EMAIL (CONSOLE FALLBACK) ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    const otpMatch = html.match(/<h2.*?>(.*?)<\/h2>/);
    if (otpMatch) {
      console.log(`OTP: ${otpMatch[1]}`);
    } else {
      console.log("--- HTML Body ---");
      console.log(html);
    }
    console.log("------------------------------------------");
    return { success: true };
  }
  // --- END DEVELOPMENT ONLY FALLBACK ---

  if (!transporter) {
    const errorMsg = "Email service is not configured.";
    console.error(`Email not sent: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  try {
    const info = await transporter.sendMail({
      from: isProduction ? SMTP_FROM : '"MiniFyn Dev" <dev@minifyn.com>',
      to,
      subject,
      html,
    });
    console.log(
      "Message sent via %s: %s",
      (transporter.options as any).host,
      info.messageId
    );
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);

    if (
      error.responseCode === 550 &&
      error.response?.includes("Unusual sending activity")
    ) {
      const userFriendlyError =
        "Our email provider has temporarily limited sending. Please try again in a few minutes.";
      return { success: false, error: userFriendlyError };
    }

    return {
      success: false,
      error: "Could not send the verification email at this time.",
    };
  }
}
