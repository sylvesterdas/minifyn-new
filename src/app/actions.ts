"use server";

import { urlSchema } from "@/lib/schema";
import {
  checkRateLimit,
  createShortLink,
  incrementUsage,
  getUserPlan,
  type UserPlan,
} from "@/lib/data";
import { validateRequest } from "@/lib/auth";
import { triggerMaintenance } from "@/lib/maintenance";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export interface FormState {
  success: boolean;
  message: string;
  shortUrl: string;
  errorCode?: "ANON_LIMIT_REACHED";
}

export async function shortenUrl(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Trigger maintenance task in the background (fire and forget)
  triggerMaintenance();

  // Securely resolve user identity on the server instead of trusting client form data
  const { user } = await validateRequest();

  let userId: string;
  let plan: UserPlan;

  if (user) {
    userId = user.uid;
    plan = user.plan || "free";
  } else {
    // For unauthenticated/guest users, derive a rate-limiting key from the client IP
    const reqHeaders = await headers();
    const forwarded = reqHeaders.get("x-forwarded-for") || reqHeaders.get("remote-addr") || "unknown";
    const rawIp = forwarded.split(",")[0].trim();
    const sanitizedIp = rawIp.replace(/[^a-zA-Z0-9_-]/g, "_") || "guest";
    userId = `anon_${sanitizedIp}`;
    plan = "anonymous";
  }

  // Check rate limit
  const isAllowed = await checkRateLimit(userId);
  if (!isAllowed) {
    const resolvedPlan = await getUserPlan(userId);
    if (resolvedPlan === "free" || resolvedPlan === "pro") {
      return {
        success: false,
        message: "Your daily link creation limit has been reached.",
        shortUrl: "",
      };
    }
    if (resolvedPlan === "anonymous" || plan === "anonymous") {
      return {
        success: false,
        message: "Daily limit of 3 URLs reached for guests.",
        errorCode: "ANON_LIMIT_REACHED",
        shortUrl: "",
      };
    }
    return { success: false, message: "Rate limit exceeded.", shortUrl: "" };
  }

  const validatedFields = await urlSchema.safeParseAsync({
    longUrl: formData.get("longUrl"),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      success: false,
      message: errors.longUrl?.[0] || "Invalid input.",
      shortUrl: "",
    };
  }

  const { longUrl } = validatedFields.data;

  try {
    const newLink = await createShortLink({ longUrl, userId });

    await incrementUsage(userId);

    const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "mnfy.in";
    const shortUrl = `https://${host}/${newLink.id}`;

    revalidatePath("/dashboard/links");

    return {
      success: true,
      message: "URL shortened successfully!",
      shortUrl: shortUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message,
      shortUrl: "",
    };
  }
}

