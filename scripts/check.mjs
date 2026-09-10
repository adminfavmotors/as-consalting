// Offline checks: no HTTP server, network requests, or ports.
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pages } from '../src/templates.mjs';
import { getConsentConfig } from '../src/consent-config.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function walk(dir) {
  const results = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...await walk(file));
    else results.push(file);
  }
  return results;
}
const files = await walk(root);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
assert.equal(htmlFiles.length, pages().length + 1, 'Expected all content pages plus 404');
const pageCache = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await readFile(file, 'utf8')])));
const descriptions = new Set();
const titles = new Set();
let links = 0;
let assets = 0;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const consentConfig = getConsentConfig();

for (const [file, html] of pageCache) {
  const name = path.relative(root, file);
  check(html.startsWith('<!doctype html>'), `${name}: missing doctype`);
  check(html.includes('<html lang="pl"'), `${name}: missing Polish language`);
  check((html.match(/<h1[\s>]/g) || []).length === 1, `${name}: expected one h1`);
  check(html.includes('name="viewport"'), `${name}: missing viewport`);
  check(html.includes('class="skip-link"'), `${name}: missing skip link`);
  check(html.includes('<main id="main"'), `${name}: missing main landmark`);
  check(html.includes('id="site-consent"') === consentConfig.enabled, `${name}: consent loader does not match build configuration`);
  check(!/\b(?:TODO|FIXME|Lorem ipsum|undefined|NaN)\b/.test(html), `${name}: placeholder text`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  check(title && !titles.has(title), `${name}: missing/duplicate title`);
  check(description && !descriptions.has(description), `${name}: missing/duplicate description`);
  titles.add(title); descriptions.add(description);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  check(new Set(ids).size === ids.length, `${name}: duplicate IDs`);
  for (const match of html.matchAll(/<img\b([^>]+)>/g)) {
    check(/\balt="[^"]*"/.test(match[1]), `${name}: image missing alt`);
    check(/\bwidth="\d+"/.test(match[1]) && /\bheight="\d+"/.test(match[1]), `${name}: image missing dimensions`);
  }
  for (const match of html.matchAll(/\baria-(?:controls|describedby|labelledby)="([^"]+)"/g)) {
    for (const id of match[1].split(' ')) check(ids.includes(id), `${name}: broken ARIA ID ${id}`);
  }
  for (const match of html.matchAll(/<label\b[^>]*for="([^"]+)"/g)) {
    check(ids.includes(match[1]), `${name}: label without input ${match[1]}`);
  }
  const references = [...html.matchAll(/<([a-z][a-z0-9-]*)\b[^>]*?\b(href|src)="([^"]+)"/g)].map((m) => ({ reference: m[3], navigation: m[1] === 'a' && m[2] === 'href' }));
  references.push(...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => ({ reference: s.trim().split(' ')[0], navigation: false }))));
  for (const { reference, navigation } of references) {
    if (/^(mailto:|tel:)/.test(reference)) { links++; continue; }
    if (/^https?:\/\//.test(reference)) {
      check(navigation && reference.startsWith('https://'), `${name}: unexpected external dependency or insecure link ${reference}`);
      if (navigation) links++;
      continue;
    }
    if (reference.startsWith('data:')) continue;
    const [rawPath, rawHash] = reference.split('#');
    const targetPath = rawPath.split('?')[0];
    let target = targetPath
      ? targetPath.startsWith('/')
        ? path.resolve(root, `.${decodeURIComponent(targetPath)}`)
        : path.resolve(path.dirname(file), decodeURIComponent(targetPath))
      : file;
    const relativeTarget = path.relative(root, target);
    check(!relativeTarget.startsWith('..') && !path.isAbsolute(relativeTarget), `${name}: path escapes dist: ${reference}`);
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch { failures.push(`${name}: missing target ${reference}`); continue; }
    if (rawHash) {
      const destination = pageCache.get(target);
      check(destination?.includes(`id="${rawHash}"`), `${name}: missing anchor ${reference}`);
    }
    if (target.endsWith('.html')) links++; else assets++;
  }
}

const css = await readFile(path.join(root, 'assets/styles.css'), 'utf8');
for (const [, reference] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
  try { await stat(path.resolve(root, 'assets', reference)); assets++; }
  catch { failures.push(`CSS: missing ${reference}`); }
}
check(css.includes('prefers-reduced-motion:reduce'), 'Missing reduced-motion styles');
check(css.includes(':focus-visible'), 'Missing keyboard focus styles');
check(css.includes('[hidden]{display:none!important}'), 'Hidden controls must remain hidden');
const js = await readFile(path.join(root, 'assets/site.js'), 'utf8');
check(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\b/.test(js), 'Unexpected network or storage side effects');
check(!/\binnerHTML\s*=/.test(js), 'Unexpected unsafe HTML insertion');

for (const page of pages()) {
  const file = path.join(root, page.route, 'index.html');
  check(pageCache.has(file), `Missing content page ${page.route || '/'}`);
}
const contact = pageCache.get(path.join(root, 'kontakt', 'index.html'));
check(contact.includes('type="email"') && contact.includes('name="message"'), 'Contact form missing fields');
check(contact.includes('Wiadomość wyślesz samodzielnie.'), 'Contact form must explain its email handoff');
const privacy = pageCache.get(path.join(root, 'polityka-prywatnosci', 'index.html'));
check(privacy?.includes('name="robots" content="noindex, nofollow"') && privacy.includes('Projekt do weryfikacji'), 'Unconfirmed privacy draft must retain its visible status and noindex');
check(contact.includes('aria-describedby="contact-privacy"'), 'Contact form must reference its visible privacy notice');
check(!/type="checkbox"/.test(contact), 'The contact composer does not require a consent checkbox');
for (const [file, html] of pageCache) {
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  check(footer?.includes('href="/polityka-prywatnosci/"'), `${path.relative(root, file)}: missing footer privacy link`);
  check(footer?.includes('href="/cookies/#ustawienia" data-cookie-settings'), `${path.relative(root, file)}: missing cookie settings fallback`);
}

// Contrast pairs used for text and interactive elements.
function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map((v) => parseInt(v, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
const color = (name) => {
  const value = css.match(new RegExp(`--${name}:#([a-f0-9]{3,6})[;}]`))?.[1];
  assert.ok(value, `Missing CSS color token: ${name}`);
  return value.length === 3 ? value.split('').map(c => c + c).join('') : value;
};
for (const [fg, bg, label] of [
  [color('ink'), color('paper'), 'body'],
  [color('muted'), color('paper'), 'muted'],
  [color('muted'), color('surface'), 'muted on grey'],
  [color('on-dark'), color('dark'), 'dark section'],
  [color('muted-dark'), color('dark'), 'muted dark'],
  [color('paper'), color('ink'), 'primary CTA'],
  [color('error'), color('surface'), 'form errors'],
]) {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  const ratio = (light + .05) / (dark + .05);
  check(ratio >= 4.5, `${label}: contrast ${ratio.toFixed(2)} below 4.5`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${htmlFiles.length} HTML pages, ${links} links, ${assets} local asset references.`);
  console.log('PASS: unique metadata, heading landmarks, IDs, form labels, ARIA references, text contrast.');
  console.log(`PASS: contact composer has no network/storage side effects; analytics integration ${consentConfig.enabled ? 'configured for ' + consentConfig.hostname : 'inactive'}.`);
  console.log('No server started. Browser rendering and hosted routing are separate checks.');
}
