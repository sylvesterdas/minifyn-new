import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
test('manifest requests only extension-local and MiniFyn API permissions', async () => {
  const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.permissions.sort(), ['activeTab', 'contextMenus', 'storage']);
  assert.deepEqual(manifest.host_permissions, ['https://www.minifyn.com/*']);
  assert.equal('content_scripts' in manifest, false);
});
