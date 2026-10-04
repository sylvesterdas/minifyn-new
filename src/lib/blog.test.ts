import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseFrontmatter, calculateReadingTime, getAllBlogPosts, getAllTags, getBlogPostBySlug, buildBlogTitle, buildBlogDescription, normalizeHeadingLevels } from './blog';

describe('blog utility', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses YAML frontmatter correctly', () => {
    const rawMarkdown = `---
title: "Test Post Title"
seoTitle: "SEO Title"
seoDescription: "A great description for SEO"
datePublished: 2025-01-01T00:00:00.000Z
slug: test-post-title
tags: nextjs, react, typescript
---

# Hello World

This is a test article body.`;

    const { data, content } = parseFrontmatter(rawMarkdown);

    expect(data.title).toBe('Test Post Title');
    expect(data.seoTitle).toBe('SEO Title');
    expect(data.seoDescription).toBe('A great description for SEO');
    expect(data.slug).toBe('test-post-title');
    expect(data.tags).toEqual(['nextjs', 'react', 'typescript']);
    expect(content.trim()).toContain('# Hello World');
  });

  it('calculates reading time accurately', () => {
    const shortText = 'One two three four five six seven eight nine ten.';
    expect(calculateReadingTime(shortText)).toBe('1 min read');

    const words450 = Array(450).fill('word').join(' ');
    expect(calculateReadingTime(words450)).toBe('3 min read');
  });

  it('loads posts from fallback manifest when offline/unauthenticated', async () => {
    const posts = await getAllBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('slug');
    expect(posts[0]).toHaveProperty('title');
  });

  it('aggregates and counts tags correctly', async () => {
    const tags = await getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0]).toHaveProperty('tag');
    expect(tags[0]).toHaveProperty('count');
    expect(tags[0].count).toBeGreaterThanOrEqual(1);
  });

  it('returns null for non-existent post slug', async () => {
    const post = await getBlogPostBySlug('non-existent-article-slug-xyz-12345');
    expect(post).toBeNull();
  });
});

describe('blog SEO helpers', () => {
  it('appends the blog suffix when the title fits', () => {
    expect(buildBlogTitle('Short title')).toBe('Short title | MiniFyn Blog');
  });

  it('truncates long titles to 60 characters without the suffix', () => {
    const title = buildBlogTitle('A very long article title that goes on and on about many different topics in detail');
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).not.toContain('| MiniFyn Blog');
  });

  it('pads short descriptions with content text', () => {
    const description = buildBlogDescription('Too short.', 'This is the body of the article with plenty of extra words to make it long enough.');
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it('truncates long descriptions to 160 characters', () => {
    expect(buildBlogDescription('word '.repeat(60)).length).toBeLessThanOrEqual(160);
  });

  it('normalizes heading levels without skips', () => {
    const tokens = [
      { type: 'heading', depth: 1 },
      { type: 'heading', depth: 4 },
      { type: 'paragraph' },
      { type: 'heading', depth: 4 },
      { type: 'heading', depth: 2 },
      { type: 'heading', depth: 3 },
    ];
    normalizeHeadingLevels(tokens);
    expect(tokens.filter((t) => t.type === 'heading').map((t) => t.depth)).toEqual([2, 3, 3, 3, 4]);
  });
});
