
'use server';

import { getPosts } from "@/lib/hashnode";

export async function loadMorePosts(cursor: string) {
    try {
        const { posts, pageInfo } = await getPosts(6, cursor);
        return { posts, pageInfo };
    } catch (error) {
        console.error("Failed to fetch more posts:", error);
        return { posts: [], pageInfo: { hasNextPage: false, endCursor: null }, error: "Could not load more posts." };
    }
}
