import { mkdir, cp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, 'src'), { recursive: true });
for (const file of ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'background.js']) await cp(resolve(root, file), resolve(dist, file));
await cp(resolve(root, 'src/core.js'), resolve(dist, 'src/core.js'));
await cp(resolve(root, 'icons'), resolve(dist, 'icons'), { recursive: true });
const require = createRequire(import.meta.url);
const { minify } = require('../../node_modules/terser');
for (const file of ['popup.js', 'background.js', 'src/core.js']) {
  const path = resolve(dist, file);
  const source = await (await import('node:fs/promises')).readFile(path, 'utf8');
  const output = await minify(source, { module: true, compress: true, mangle: true, format: { comments: false } });
  await writeFile(path, `${output.code}\n`);
}
console.log(`Built ${dist}`);
