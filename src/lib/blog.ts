import { Marked } from 'marked';
import fallbackManifest from '@/content/blog-manifest.json';

export interface BlogPostMeta {
  filename: string;
  cuid: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  datePublished: string;
  slug: string;
  cover: string;
  ogImage: string;
  tags: string[];
  canonical: string;
  readingTime?: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
  rawContent: string;
}

const GITHUB_REPO_TREE_URL = 'https://api.github.com/repos/sylvesterdas/Articles/git/trees/main?recursive=1';
const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/sylvesterdas/Articles/main';

const marked = new Marked({
  gfm: true,
  breaks: true,
});

export function isBrokenOrTemporaryHost(url: string | undefined): boolean {
  if (!url) return true;
  return url.includes('i.ibb.co') || url.includes('n8n.sylvesterdas.com');
}

export function resolvePostCover(cover: string | undefined, title: string, tag: string = 'Tech'): string {
  if (isBrokenOrTemporaryHost(cover)) {
    return `/api/og?title=${encodeURIComponent(title)}&tag=${encodeURIComponent(tag)}`;
  }
  return cover as string;
}

export function sanitizeMarkdownContent(rawContent: string): string {
  return rawContent
    .replace(/!\[(.*?)\]\(https?:\/\/(i\.ibb\.co|n8n\.sylvesterdas\.com)\/[^\)]+\)/gi, '')
    .replace(/<img[^>]*src=["']https?:\/\/(i\.ibb\.co|n8n\.sylvesterdas\.com)\/[^"']*["'][^>]*>/gi, '');
}

export function parseFrontmatter(text: string): { data: Record<string, any>; content: string } {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  const rawYaml = match[1];
  const rawBody = match[2];
  const content = sanitizeMarkdownContent(rawBody);
  const data: Record<string, any> = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    if (key === 'tags') {
      data[key] = val
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else {
      data[key] = val;
    }
  }

  return { data, content };
}

export function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function getAllBlogPosts(): Promise<BlogPostMeta[]> {
  try {
    const res = await fetch(GITHUB_REPO_TREE_URL, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    } as RequestInit);

    if (!res.ok) {
      return fallbackManifest as BlogPostMeta[];
    }

    const json = await res.json();
    const mdFiles = (json.tree || []).filter((f: any) => typeof f.path === 'string' && f.path.endsWith('.md'));

    if (!mdFiles.length) {
      return fallbackManifest as BlogPostMeta[];
    }

    const posts: BlogPostMeta[] = [];
    const concurrency = 20;

    for (let i = 0; i < mdFiles.length; i += concurrency) {
      const batch = mdFiles.slice(i, i + concurrency);
      const results = await Promise.all(
        batch.map(async (file: any) => {
          try {
            const rawRes = await fetch(`${GITHUB_RAW_BASE_URL}/${file.path}`, {
              next: { revalidate: 3600 },
            } as RequestInit);
            if (!rawRes.ok) return null;
            const text = await rawRes.text();
            const { data } = parseFrontmatter(text);

            const title = data.title || '';
            const tags = Array.isArray(data.tags) ? data.tags : [];
            const primaryTag = tags[0] || 'Tech';
            const cover = resolvePostCover(data.cover, title, primaryTag);
            const ogImage = resolvePostCover(data.ogImage || data.cover, title, primaryTag);

            return {
              filename: file.path,
              cuid: data.cuid || file.path.replace('.md', ''),
              title,
              seoTitle: data.seoTitle || title,
              seoDescription: data.seoDescription || '',
              datePublished: data.datePublished ? new Date(data.datePublished).toISOString() : new Date().toISOString(),
              slug: data.slug || file.path.replace('.md', ''),
              cover,
              ogImage,
              tags,
              canonical: data.canonical || `https://www.minifyn.com/blog/${data.slug || ''}`,
            } as BlogPostMeta;
          } catch {
            return null;
          }
        })
      );

      for (const r of results) {
        if (r && r.slug) posts.push(r);
      }
    }

    if (posts.length > 0) {
      posts.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
      return posts;
    }

    return fallbackManifest as BlogPostMeta[];
  } catch {
    return fallbackManifest as BlogPostMeta[];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  const meta = allPosts.find((p) => p.slug === slug || p.cuid === slug);

  if (!meta) {
    return null;
  }

  try {
    const rawRes = await fetch(`${GITHUB_RAW_BASE_URL}/${meta.filename}`, {
      next: { revalidate: 3600 },
    } as RequestInit);

    if (!rawRes.ok) {
      return null;
    }

    const rawText = await rawRes.text();
    const { content } = parseFrontmatter(rawText);
    const contentHtml = await marked.parse(content);
    const readingTime = calculateReadingTime(content);

    return {
      ...meta,
      contentHtml,
      rawContent: content,
      readingTime,
    };
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllBlogPosts();
  const tagCounts: Record<string, number> = {};

  for (const post of posts) {
    for (const t of post.tags) {
      const normalized = t.toLowerCase().trim();
      if (normalized) {
        tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
      }
    }
  }

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
