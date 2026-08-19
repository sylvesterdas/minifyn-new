"use server";

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || process.env.MAILTRAP_HOST;
const portStr = process.env.SMTP_PORT || process.env.MAILTRAP_PORT;
const user = process.env.SMTP_USER || process.env.MAILTRAP_USER;
const pass = process.env.SMTP_PASS || process.env.MAILTRAP_PASS;
const from = process.env.SMTP_FROM || "MiniFyn <noreply@minifyn.com>";

let transporter: nodemailer.Transporter | null = null;

if (host && portStr && user && pass) {
  const port = parseInt(portStr, 10);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
} else {
  console.log(
    "SMTP service is not configured. Email sending will be logged to the console."
  );
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
  const isProduction = process.env.NODE_ENV === "production";

  // --- DEVELOPMENT CONSOLE FALLBACK ---
  // If in development and no transporter is configured,
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
      from,
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
