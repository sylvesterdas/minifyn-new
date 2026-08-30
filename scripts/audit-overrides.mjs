import fs from 'node:fs';

const source = fs.readFileSync(new URL('../pnpm-workspace.yaml', import.meta.url), 'utf8');
const section = source.split(/^overrides:\n/m)[1]?.split(/^packages:\n/m)[0] ?? '';
const entries = section.split('\n').filter((line) => /^  \S/.test(line)).map((line) => line.trim());
console.log(`Override entries: ${entries.length}`);
for (const entry of entries) console.log(`- ${entry}`);
console.log('\nRemove entries only after pnpm audit, typecheck, tests, and build pass.');
