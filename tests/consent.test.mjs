import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { getConsentConfig } from '../src/consent-config.mjs';

const source = readFileSync(new URL('../public/assets/consent.js', import.meta.url), 'utf8');
const settings = {
  cookiebotId: '12345678-1234-1234-1234-123456789abc',
  measurementId: 'G-TEST123456',
  hostname: 'example.com',
};
// Vendor scripts never run here. The harness observes loading, consent transitions
// and queued commands; actual vendor/network behavior needs a configured preview.
function harness({ hostname = 'example.com', protocol = 'https:', declaration = false } = {}) {
  const scripts = [];
  const cookieWrites = [];
  const listeners = new Map();
  const handlers = new Map();
  const status = { textContent: '' };
  const control = { addEventListener: (type, handler) => handlers.set(type, handler) };
  const append = (script) => scripts.push(script);
  const declarationNode = { append, textContent: '' };
  const document = {
    currentScript: { dataset: settings },
    title: 'Kontakt | A.S. Consulting',
    referrer: 'https://referrer.example/path?email=person@example.com#private',
    head: { append },
    querySelector: () => declaration ? declarationNode : null,
    querySelectorAll: (selector) => selector === '[data-cookie-settings]' ? [control] : [status],
    createElement: () => ({ dataset: {}, remove() { scripts.splice(scripts.indexOf(this), 1); } }),
  };
  Object.defineProperty(document, 'cookie', {
    get: () => '_ga=client; _ga_TEST123456=session; CookieConsent=saved; useful=value',
    set: (value) => cookieWrites.push(value),
  });
  const window = {
    addEventListener: (type, handler) => listeners.set(type, [...(listeners.get(type) || []), handler]),
  };
  const location = { hostname, protocol, href: `${protocol}//${hostname}/kontakt/?email=secret@example.com#message` };
  vm.runInNewContext(source, { window, document, location, URL });
  const emit = (event) => (listeners.get(event) || []).forEach((handler) => handler());
  const respond = (statistics, method = 'explicit') => {
    window.Cookiebot = { hasResponse: true, consent: { statistics, method } };
    emit('CookiebotOnConsentReady');
  };
  const google = () => scripts.filter((script) => script.src.includes('googletagmanager.com'));
  const commands = () => Array.from(window.dataLayer || [], (args) => Array.from(args));
  return { scripts, google, commands, window, respond, emit, handlers, cookieWrites, status, declarationNode };
}

test('no configuration is offline; partial or malformed configuration cannot activate tracking', () => {
  assert.equal(getConsentConfig({}).enabled, false);
  const env = { COOKIEBOT_DOMAIN_GROUP_ID: settings.cookiebotId, GA_MEASUREMENT_ID: settings.measurementId, ANALYTICS_HOSTNAME: settings.hostname };
  assert.equal(getConsentConfig(env).enabled, true);
  assert.throws(() => getConsentConfig({ GA_MEASUREMENT_ID: settings.measurementId }));
  for (const bad of [
    { ANALYTICS_HOSTNAME: 'https://example.com/' },
    { ANALYTICS_HOSTNAME: 'example.com:443' },
    { ANALYTICS_HOSTNAME: 'example.com/path' },
    { GA_MEASUREMENT_ID: 'G-123\" onload=\"bad' },
    { COOKIEBOT_DOMAIN_GROUP_ID: 'not-a-domain-group' },
  ]) assert.throws(() => getConsentConfig({ ...env, ...bad }));
});

test('no CMP or GA request on other preview domains or insecure origins', () => {
  assert.equal(harness({ hostname: 'preview.vercel.app' }).scripts.length, 0);
  assert.equal(harness({ protocol: 'http:' }).scripts.length, 0);
});

test('first visit and rejection never load Google; all consent defaults are denied', () => {
  const h = harness();
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].src, 'https://consent.cookiebot.eu/uc.js');
  assert.equal(h.scripts[0].dataset.consentmode, 'disabled');
  const defaults = h.commands()[0];
  assert.equal(defaults[0], 'consent');
  assert.equal(defaults[1], 'default');
  assert.ok(Object.values(defaults[2]).every((value) => value === 'denied'));
  h.respond(false);
  h.emit('CookiebotOnDecline');
  assert.equal(h.google().length, 0);
  assert.equal(h.commands().filter(([command]) => command === 'config').length, 0);
});

test('implied or unanswered consent is insufficient even with statistics=true', () => {
  const h = harness();
  h.respond(true, 'implied');
  assert.equal(h.google().length, 0);
  h.window.Cookiebot.hasResponse = false;
  h.window.Cookiebot.consent.method = 'explicit';
  h.emit('CookiebotOnAccept');
  assert.equal(h.google().length, 0);
});

test('explicit saved/new consent loads one tag and sends one sanitized page view', () => {
  const h = harness();
  h.respond(true);
  h.emit('CookiebotOnAccept');
  assert.equal(h.google().length, 1);
  assert.equal(h.commands().filter(([command]) => command === 'event').length, 0);
  h.google()[0].onload();
  h.emit('CookiebotOnConsentReady');
  const events = h.commands().filter(([command]) => command === 'event');
  assert.equal(events.length, 1);
  assert.equal(events[0][1], 'page_view');
  assert.equal(events[0][2].page_location, 'https://example.com/kontakt/');
  assert.equal(events[0][2].page_referrer, 'https://referrer.example/path');
  const config = h.commands().find(([command]) => command === 'config')[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.cookie_update, false);
  assert.equal(config.cookie_expires, 31536000);
  for (const [, , state] of h.commands().filter(([command]) => command === 'consent')) {
    for (const name of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(state[name], 'denied');
  }
});

test('withdrawal while Google loads cannot configure analytics or send a page view', () => {
  const h = harness();
  h.respond(true);
  const tag = h.google()[0];
  h.respond(false);
  tag.onload();
  assert.equal(h.window[`ga-disable-${settings.measurementId}`], true);
  assert.equal(h.commands().filter(([command]) => ['config', 'event'].includes(command)).length, 0);
});

test('withdrawal disables GA and removes only analytics cookies; reaccept does not duplicate page views', () => {
  const h = harness();
  h.respond(true);
  h.google()[0].onload();
  h.respond(false);
  assert.equal(h.window[`ga-disable-${settings.measurementId}`], true);
  assert.ok(h.cookieWrites.some((value) => value.startsWith('_ga=')));
  assert.ok(h.cookieWrites.some((value) => value.startsWith('_ga_TEST123456=')));
  assert.ok(h.cookieWrites.every((value) => !/^(CookieConsent|useful)=/.test(value)));
  h.respond(true);
  assert.equal(h.google().length, 1);
  assert.equal(h.commands().filter(([command]) => command === 'event').length, 1);
});

test('CMP failure stays closed; settings keep a normal link fallback', () => {
  const h = harness();
  h.scripts[0].onerror();
  assert.equal(h.google().length, 0);
  assert.match(h.status.textContent, /Analityka pozostaje wyłączona/);
  let prevented = false;
  h.handlers.get('click')({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, false);
  let opened = false;
  h.window.Cookiebot = { renew: () => { opened = true; } };
  h.handlers.get('click')({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(opened, true);
});

test('Google load failure sends no measurement and leaves consent controls usable', () => {
  const h = harness();
  h.respond(true);
  h.google()[0].onerror();
  assert.equal(h.window[`ga-disable-${settings.measurementId}`], true);
  assert.equal(h.commands().filter(([command]) => command === 'event').length, 0);
  h.respond(false);
  assert.equal(h.google().length, 0);
});

test('Cookiebot declaration loads only in its designated page slot', () => {
  assert.equal(harness().scripts.some((script) => script.id === 'CookieDeclaration'), false);
  const h = harness({ declaration: true });
  assert.equal(h.scripts.find((script) => script.id === 'CookieDeclaration').src, `https://consent.cookiebot.eu/${settings.cookiebotId}/cd.js`);
});
