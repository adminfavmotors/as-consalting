import { mkdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pages, layout, notFound } from '../src/templates.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
await mkdir(out, { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });
const allPages = pages();
for (const page of allPages) {
  const directory = path.join(out, page.route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), layout(page), 'utf8');
}
await writeFile(path.join(out, '404.html'), notFound(), 'utf8');
await writeFile(path.join(out, 'page-manifest.json'), JSON.stringify(allPages.map(({ route, title }) => ({ path: `${route ? route + '/' : ''}index.html`, title })), null, 2) + '\n');
console.log(`Built ${allPages.length} pages and 404.html in ${out}`);
console.log('Static files only. No server started; no ports opened.');
