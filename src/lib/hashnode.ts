"use server";

// Reverting to environment variables as the hardcoded test proved they are not the issue.
const HASHNODE_GQL_ENDPOINT = process.env.HASHNODE_GQL_ENDPOINT!;
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID!;
const HASHNODE_ACCESS_TOKEN = process.env.NEXT_HASHNODE_ACCESS_TOKEN!;

export interface HashnodePost {
  id: string;
  slug: string;
  title: string;
  url: string;
  brief: string;
  publishedAt: string;
  updatedAt: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture?: string;
  };
  tags: {
    name: string;
    slug: string;
  }[];
  coverImage: {
    url: string;
  } | null;
  ogImage: {
    url: string;
  } | null;
  content: {
    html: string;
  };
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface HashnodePostsResponse {
  data: {
    publication: {
      posts: {
        edges: {
          node: Omit<
            HashnodePost,
            "content" | "ogImage" | "updatedAt" | "brief"
          >;
        }[];
        pageInfo: PageInfo;
      };
    };
  };
}

interface HashnodePostResponse {
  data: {
    publication: {
      post: HashnodePost;
    };
  };
}


async function fetchFromHashnode<T>(query: string, variables: Record<string, any>): Promise<T> {
  if (!HASHNODE_GQL_ENDPOINT) {
    throw new Error('Hashnode GraphQL endpoint is not configured.');
  }

  const res = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Hashnode API Error:", errorText);
    throw new Error(`Failed to fetch from Hashnode API. Status: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// --- START: ALIAS CACHE BUSTING ---
// We generate a unique query string for every request by adding a dynamic alias
// to a field. This forces the CDN to treat it as a new query.
const generateGetPostsQuery = () => {
  const cacheBusterAlias = `_cacheBuster${Date.now()}`;
  return `
    query GetPosts($publicationId: ObjectId!, $first: Int!, $after: String) {
      publication(id: $publicationId) {
        ${cacheBusterAlias}: __typename # Add a dynamic alias to a meta-field
        posts(first: $first, after: $after) {
          edges {
            node {
              id
              slug
              title
              url
              brief
              publishedAt
              updatedAt
              readTimeInMinutes
              author {
                  name
                  profilePicture
              }
              tags {
                  name
                  slug
              }
              coverImage {
                url
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;
};
// --- END: ALIAS CACHE BUSTING ---

export async function getPosts(
  first: number = 12,
  after?: string | null
): Promise<{
  posts: any;
  pageInfo: PageInfo;
}> {
  const GET_POSTS_QUERY = generateGetPostsQuery(); // Generate a unique query
  const response = await fetchFromHashnode<HashnodePostsResponse>(
    GET_POSTS_QUERY,
    {
      publicationId: HASHNODE_PUBLICATION_ID,
      first,
      after: after ?? null,
    }
  );
  const posts = response.data.publication.posts.edges.map((edge) => edge.node) as any;
  const pageInfo = response.data.publication.posts.pageInfo;
  return { posts, pageInfo };
}

// The single post query is less likely to have this issue, but we'll leave it as is for now.
const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($publicationId: ObjectId!, $slug: String!) {
    publication(id: $publicationId) {
      post(slug: $slug) {
        id
        slug
        title
        url
        brief
        publishedAt
        updatedAt
        readTimeInMinutes
        author {
            name
            profilePicture
        }
        tags {
            name
            slug
        }
        ogImage: ogMetaData {
            image
        }
        coverImage {
          url
        }
        content {
          html
        }
      }
    }
  }
`;

export async function getPostBySlug(
  slug: string
): Promise<HashnodePost | null> {
  const response = await fetchFromHashnode<HashnodePostResponse>(
    GET_POST_BY_SLUG_QUERY,
    {
      publicationId: HASHNODE_PUBLICATION_ID,
      slug,
    }
  );

  const post = response.data.publication.post;
  if (post && post.ogImage) {
    (post.ogImage as any).url = (post.ogImage as any).image;
    delete (post.ogImage as any).image;
  }
  return post;
}
