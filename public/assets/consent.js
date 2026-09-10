(() => {
  'use strict';
  const config = document.currentScript?.dataset;
  // Never initialize the CMP or production analytics on an unrelated preview URL.
  if (!config || location.protocol !== 'https:' || location.hostname !== config.hostname) return;
  const id = config.measurementId;
  const disableKey = `ga-disable-${id}`;
  window[disableKey] = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const consent = (analytics) => ({
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('consent', 'default', consent(false));
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('set', 'url_passthrough', false);

  let tag = null;
  let tagLoaded = false;
  let configured = false;
  let pageViewed = false;
  let permitted = false;
  const hasStatisticsConsent = () => window.Cookiebot?.hasResponse === true
    && window.Cookiebot.consent?.method === 'explicit'
    && window.Cookiebot.consent.statistics === true;
  const status = (message) => {
    document.querySelectorAll('[data-cookie-status]').forEach((node) => { node.textContent = message; });
  };
  const cleanURL = (value) => {
    try {
      const url = new URL(value);
      return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}` : '';
    } catch { return ''; }
  };
  function removeAnalyticsCookies() {
    const domains = location.hostname.split('.').map((_, index, parts) => parts.slice(index).join('.'));
    for (const item of document.cookie.split(';')) {
      const name = item.trim().split('=')[0];
      if (!/^_ga(?:_[a-zA-Z0-9_]+)?$/.test(name)) continue;
      const expired = `${name}=; Max-Age=0; path=/; SameSite=Lax; Secure`;
      document.cookie = expired;
      for (const domain of domains) {
        document.cookie = `${expired}; domain=${domain}`;
        document.cookie = `${expired}; domain=.${domain}`;
      }
    }
  }
  function startMeasurement() {
    if (!tagLoaded || !hasStatisticsConsent()) return;
    window[disableKey] = false;
    if (!configured) {
      configured = true;
      window.gtag('js', new Date());
      window.gtag('config', id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_domain: location.hostname,
        cookie_path: '/',
        cookie_expires: 60 * 60 * 24 * 365,
        cookie_update: false,
        cookie_flags: 'SameSite=Lax;Secure',
        page_location: cleanURL(location.href),
        page_referrer: cleanURL(document.referrer),
      });
    }
    if (!pageViewed) {
      pageViewed = true;
      window.gtag('event', 'page_view', {
        send_to: id,
        page_location: cleanURL(location.href),
        page_referrer: cleanURL(document.referrer),
        page_title: document.title,
      });
    }
  }
  function synchronizeConsent() {
    const allowed = hasStatisticsConsent();
    // Set the documented GA opt-out flag before the consent update on withdrawal.
    window[disableKey] = !allowed;
    if (!allowed) {
      if (permitted) window.gtag('consent', 'update', consent(false));
      permitted = false;
      removeAnalyticsCookies();
      status('Statystyki są wyłączone. Możesz zmienić swój wybór w ustawieniach cookies.');
      return;
    }
    if (!permitted) window.gtag('consent', 'update', consent(true));
    permitted = true;
    status('Wyrażono zgodę na statystyki. Możesz ją wycofać w ustawieniach cookies.');
    if (tagLoaded) { startMeasurement(); return; }
    if (tag) return;
    tag = document.createElement('script');
    tag.id = 'google-analytics';
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    tag.onload = () => { tagLoaded = true; startMeasurement(); };
    tag.onerror = () => {
      window[disableKey] = true;
      tag.remove();
      tag = null;
      status('Statystyki nie zostały uruchomione. Możesz nadal korzystać ze strony i zmienić zgodę.');
    };
    document.head.append(tag);
  }
  for (const event of ['CookiebotOnConsentReady', 'CookiebotOnAccept', 'CookiebotOnDecline']) {
    window.addEventListener(event, synchronizeConsent);
  }
  document.querySelectorAll('[data-cookie-settings]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (typeof window.Cookiebot?.renew !== 'function') return;
      event.preventDefault();
      window.Cookiebot.renew();
    });
  });

  const cmp = document.createElement('script');
  cmp.id = 'Cookiebot';
  cmp.src = 'https://consent.cookiebot.eu/uc.js';
  cmp.async = true;
  cmp.dataset.cbid = config.cookiebotId;
  cmp.dataset.culture = 'PL';
  cmp.dataset.level = 'strict';
  cmp.dataset.blockingmode = 'none';
  // This adapter owns Consent Mode updates; avoid a second conflicting writer.
  cmp.dataset.consentmode = 'disabled';
  cmp.onerror = () => {
    window[disableKey] = true;
    status('Panel cookies jest chwilowo niedostępny. Analityka pozostaje wyłączona. Spróbuj odświeżyć stronę.');
  };
  document.head.append(cmp);

  const declaration = document.querySelector('[data-cookie-declaration]');
  if (declaration) {
    const script = document.createElement('script');
    script.id = 'CookieDeclaration';
    script.async = true;
    script.dataset.culture = 'PL';
    script.src = `https://consent.cookiebot.eu/${config.cookiebotId}/cd.js`;
    script.onerror = () => { declaration.textContent = 'Wykaz cookies jest chwilowo niedostępny. Opis kategorii znajduje się powyżej.'; };
    declaration.append(script);
  }
})();
