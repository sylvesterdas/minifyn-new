const HASHNODE_GQL_ENDPOINT = process.env.HASHNODE_GQL_ENDPOINT!;
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID!;
const HASHNODE_ACCESS_TOKEN = process.env.NEXT_HASHNODE_ACCESS_TOKEN!;

interface HashnodePost {
    id: string;
    slug: string;
    title: string;
    brief: string;
    publishedAt: string;
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

interface HashnodeResponse {
    data: {
        publication: {
            posts: {
                edges: { node: HashnodePost }[];
            };
        }
    }
}

interface HashnodePostResponse {
    data: {
        publication: {
            post: HashnodePost;
        }
    }
}

async function fetchFromHashnode<T>(query: string, variables: Record<string, any>): Promise<T> {
    const res = await fetch(HASHNODE_GQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': HASHNODE_ACCESS_TOKEN
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!res.ok) {
        console.error("Hashnode API Error:", await res.text());
        throw new Error('Failed to fetch from Hashnode API');
    }

    return res.json() as Promise<T>;
}

const GET_POSTS_QUERY = `
  query GetPosts($publicationId: ObjectId!) {
    publication(id: $publicationId) {
      posts(first: 10) {
        edges {
          node {
            id
            slug
            title
            brief
            publishedAt
            coverImage {
              url
            }
          }
        }
      }
    }
  }
`;

export async function getPosts(): Promise<Omit<HashnodePost, 'content' | 'ogImage'>[]> {
    const response = await fetchFromHashnode<HashnodeResponse>(GET_POSTS_QUERY, {
        publicationId: HASHNODE_PUBLICATION_ID
    });
    return response.data.publication.posts.edges.map(edge => edge.node);
}

const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($publicationId: ObjectId!, $slug: String!) {
    publication(id: $publicationId) {
      post(slug: $slug) {
        id
        slug
        title
        brief
        publishedAt
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

export async function getPostBySlug(slug: string): Promise<HashnodePost | null> {
    const response = await fetchFromHashnode<HashnodePostResponse>(GET_POST_BY_SLUG_QUERY, {
        publicationId: HASHNODE_PUBLICATION_ID,
        slug
    });
    return response.data.publication.post;
}
