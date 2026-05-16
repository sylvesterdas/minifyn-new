"use server";

const DEFAULT_HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";
const HASHNODE_RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const HASHNODE_MAX_ATTEMPTS = 3;

export interface HashnodePost {
  id: string;
  slug: string;
  title: string;
  url: string;
  canonicalUrl?: string | null;
  brief: string;
  publishedAt: string;
  updatedAt?: string | null;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture?: string;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  } | null;
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
          node: Omit<HashnodePost, "content" | "ogImage">;
        }[];
        pageInfo: PageInfo;
      };
    };
  };
}

interface HashnodePostResponse {
  data: {
    publication: {
      post: HashnodePost | null;
    };
  };
}

interface HashnodeGraphQLError {
  message?: string;
}

interface HashnodeGraphQLResponse {
  errors?: HashnodeGraphQLError[];
}

class HashnodeApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "HashnodeApiError";
    this.status = status;
  }
}

function getHashnodeConfig() {
  const configuredEndpoint = process.env.HASHNODE_GQL_ENDPOINT
    ?.trim()
    .replace(/^['"]|['"]$/g, "");
  const endpoint = configuredEndpoint || DEFAULT_HASHNODE_GQL_ENDPOINT;

  return {
    endpoint: endpoint.replace(/\/$/, ""),
    publicationId: process.env.HASHNODE_PUBLICATION_ID,
    accessToken: process.env.NEXT_HASHNODE_ACCESS_TOKEN,
  };
}

function getResponsePreview(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 160);
}

function isJsonContentType(contentType: string) {
  return /(^|[/+])json($|;)/i.test(contentType);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromHashnode<T>(query: string, variables: Record<string, any>): Promise<T> {
  const { endpoint, accessToken } = getHashnodeConfig();

  if (!endpoint) {
    throw new Error('Hashnode GraphQL endpoint is not configured.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = accessToken;
  }

  let res: Response | null = null;
  let responseText = "";

  for (let attempt = 1; attempt <= HASHNODE_MAX_ATTEMPTS; attempt += 1) {
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
        redirect: 'manual',
      });
      responseText = await res.text();
    } catch (error) {
      if (attempt === HASHNODE_MAX_ATTEMPTS) {
        throw new HashnodeApiError("Failed to reach Hashnode API.");
      }

      await wait(150 * attempt);
      continue;
    }

    if (!HASHNODE_RETRY_STATUSES.has(res.status) || attempt === HASHNODE_MAX_ATTEMPTS) {
      break;
    }

    await wait(150 * attempt);
  }

  if (!res) {
    throw new HashnodeApiError("Failed to reach Hashnode API.");
  }

  const contentType = res.headers.get('content-type') || 'unknown';

  if ([301, 302, 307, 308].includes(res.status)) {
    const location = res.headers.get('location');
    const message = location?.includes('/announcements/graphql-api') || location?.includes('/graphql-api-paid-access')
      ? 'Hashnode GraphQL API access now requires paid allow-listing for your publication.'
      : `Hashnode GraphQL API redirected to ${location || 'another URL'}.`;
    throw new HashnodeApiError(message, res.status);
  }

  if (!res.ok) {
    console.warn("Hashnode API Error:", getResponsePreview(responseText));
    throw new HashnodeApiError(`Failed to fetch from Hashnode API. Status: ${res.status}`, res.status);
  }

  if (!isJsonContentType(contentType)) {
    console.error("Hashnode API returned a non-JSON response:", {
      status: res.status,
      contentType,
      preview: getResponsePreview(responseText),
    });
    throw new HashnodeApiError(`Hashnode API returned ${contentType} instead of JSON. Check HASHNODE_GQL_ENDPOINT.`, res.status);
  }

  let json: T & HashnodeGraphQLResponse;
  try {
    json = JSON.parse(responseText) as T & HashnodeGraphQLResponse;
  } catch (error) {
    console.error("Hashnode API returned invalid JSON:", {
      status: res.status,
      contentType,
      preview: getResponsePreview(responseText),
    });
    throw new Error("Hashnode API returned invalid JSON.");
  }

  if (json.errors?.length) {
    const message = json.errors
      .map((graphqlError) => graphqlError.message)
      .filter(Boolean)
      .join('; ');
    throw new Error(`Hashnode API GraphQL error: ${message || 'Unknown error'}`);
  }

  return json;
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
              canonicalUrl
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
              seo {
                title
                description
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
  posts: Omit<HashnodePost, "content" | "ogImage">[];
  pageInfo: PageInfo;
}> {
  const { publicationId } = getHashnodeConfig();
  if (!publicationId) {
    throw new Error('Hashnode publication ID is not configured.');
  }

  const GET_POSTS_QUERY = generateGetPostsQuery(); // Generate a unique query
  const response = await fetchFromHashnode<HashnodePostsResponse>(
    GET_POSTS_QUERY,
    {
      publicationId,
      first,
      after: after ?? null,
    }
  );
  const posts = response.data.publication.posts.edges.map((edge) => edge.node);
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
        canonicalUrl
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
        seo {
            title
            description
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
  const { publicationId } = getHashnodeConfig();
  if (!publicationId) {
    throw new Error('Hashnode publication ID is not configured.');
  }

  const response = await fetchFromHashnode<HashnodePostResponse>(
    GET_POST_BY_SLUG_QUERY,
    {
      publicationId,
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
