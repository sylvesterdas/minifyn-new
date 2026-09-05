import fs from 'node:fs/promises';

function isBrokenOrTemporaryHost(url) {
  if (!url) return true;
  return url.includes('i.ibb.co') || url.includes('n8n.sylvesterdas.com');
}

function resolvePostCover(cover, title, tag = 'Tech') {
  if (isBrokenOrTemporaryHost(cover)) {
    return `/api/og?title=${encodeURIComponent(title)}&tag=${encodeURIComponent(tag)}`;
  }
  return cover;
}

function sanitizeMarkdownContent(rawContent) {
  return rawContent
    .replace(/!\[(.*?)\]\(https?:\/\/(i\.ibb\.co|n8n\.sylvesterdas\.com)\/[^\)]+\)/gi, '')
    .replace(/<img[^>]*src=["']https?:\/\/(i\.ibb\.co|n8n\.sylvesterdas\.com)\/[^"']*["'][^>]*>/gi, '');
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: text };
  const rawYaml = match[1];
  const rawBody = match[2];
  const content = sanitizeMarkdownContent(rawBody);
  const data = {};

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

async function run() {
  const treeRes = await fetch('https://api.github.com/repos/sylvesterdas/Articles/git/trees/main?recursive=1');
  const tree = await treeRes.json();
  const mdFiles = (tree.tree || []).filter((f) => typeof f.path === 'string' && f.path.endsWith('.md'));

  const posts = [];
  const concurrency = 25;
  for (let i = 0; i < mdFiles.length; i += concurrency) {
    const batch = mdFiles.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (file) => {
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/sylvesterdas/Articles/main/${file.path}`);
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
          };
        } catch {
          return null;
        }
      })
    );
    for (const r of results) if (r && r.slug) posts.push(r);
  }
  posts.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  await fs.mkdir('src/content', { recursive: true });
  await fs.writeFile('src/content/blog-manifest.json', JSON.stringify(posts, null, 2));
  console.log(`Synced ${posts.length} articles to src/content/blog-manifest.json`);
}

run();
