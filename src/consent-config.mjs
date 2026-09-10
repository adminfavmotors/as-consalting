export function getConsentConfig(env = process.env) {
  const config = {
    cookiebotId: (env.COOKIEBOT_DOMAIN_GROUP_ID || '').trim(),
    measurementId: (env.GA_MEASUREMENT_ID || '').trim(),
    hostname: (env.ANALYTICS_HOSTNAME || '').trim().toLowerCase(),
  };
  const values = Object.values(config);
  if (values.every((value) => !value)) return { enabled: false, ...config };
  if (values.some((value) => !value)) throw new Error('Set COOKIEBOT_DOMAIN_GROUP_ID, GA_MEASUREMENT_ID and ANALYTICS_HOSTNAME together, or leave all three unset.');
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(config.cookiebotId)) throw new Error('COOKIEBOT_DOMAIN_GROUP_ID must be the UUID from Cookiebot.');
  if (!/^G-[A-Z0-9]{6,20}$/.test(config.measurementId)) throw new Error('GA_MEASUREMENT_ID must be a GA4 G- identifier.');
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(config.hostname)) throw new Error('ANALYTICS_HOSTNAME must be one exact hostname without protocol, path or port.');
  return { enabled: true, ...config };
}

export function consentScript() {
  const config = getConsentConfig();
  if (!config.enabled) return '';
  return `<script id="site-consent" src="/assets/consent.js" data-cookiebot-id="${config.cookiebotId}" data-measurement-id="${config.measurementId}" data-hostname="${config.hostname}" data-cookieconsent="ignore" defer></script>`;
}
