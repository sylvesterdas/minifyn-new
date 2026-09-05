import { describe, it, expect } from 'vitest';
import { parseFrontmatter, calculateReadingTime, getAllBlogPosts, getAllTags, getBlogPostBySlug } from './blog';

describe('blog utility', () => {
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
