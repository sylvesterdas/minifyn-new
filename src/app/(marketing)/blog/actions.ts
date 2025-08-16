"use server";

import { getPosts } from "@/lib/hashnode";
import { db } from "@/lib/firebase-admin";
import { createShortLink } from "@/lib/data";
import { SUPER_USER_ID } from "@/lib/config";

export async function loadMorePosts(cursor: string) {
  try {
    const { posts, pageInfo } = await getPosts(10, cursor);
    return { posts, pageInfo };
  } catch (error) {
    console.error("Failed to fetch more posts:", error);
    return {
      posts: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: "Could not load more posts.",
    };
  }
}

export async function getOrCreateShortUrlForPost(
  longUrl: string
): Promise<string | null> {
  try {
    const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "mnfy.in";

    // 1. Check if a short link already exists for this long URL from the super user
    const query = db
      .ref("urls")
      .orderByChild("longUrl")
      .equalTo(longUrl)
      .limitToFirst(10); // Limit to check a few, in case of duplicates

    const snapshot = await query.once("value");

    if (snapshot.exists()) {
      const links = snapshot.val();
      for (const slug in links) {
        if (links[slug].userId === SUPER_USER_ID) {
          return `https://${host}/${slug}`;
        }
      }
    }

    // 2. If not, create a new one
    console.log(`No short URL found for ${longUrl}. Creating a new one.`);
    const newLink = await createShortLink({
      longUrl,
      userId: SUPER_USER_ID,
      isVerifiedUser: true, // Super user is always verified
    });

    return `https://${host}/${newLink.id}`;
  } catch (error) {
    console.error("Error in getOrCreateShortUrlForPost:", error);
    // Fallback to the original long URL if something goes wrong
    return longUrl;
  }
}
