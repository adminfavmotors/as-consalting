// Optional asset preparation, not needed for normal builds.
// Usage: node scripts/prepare-images.mjs <absolute path to installed sharp package>
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const original = path.join(root, 'design', 'automotive-original.png');
const assets = path.join(root, 'public', 'assets');
await Promise.all([
  sharp(original).resize({ width: 960, height: 540, fit: 'cover' }).webp({ quality: 84 }).toFile(path.join(assets, 'automotive-960.webp')),
  sharp(original).resize({ width: 1600, height: 900, fit: 'cover' }).webp({ quality: 86 }).toFile(path.join(assets, 'automotive-1600.webp')),
  sharp(original).resize({ width: 1600, height: 900, fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(assets, 'automotive.jpg')),
]);
console.log('Prepared local, optimized hero assets (WebP and JPEG fallback).');
