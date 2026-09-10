import { company, services, clients, career } from './content.mjs';

export const escape = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const diagonal = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const iconPaths = {
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 9h10M7 13h10M7 17h5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  growth: '<path d="M4 20h16M6 16v-4m6 4V8m6 8V4M4 8l5-5 4 2 6-3"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"/>',
  phone: '<path d="m8 3 3 5-3 3a18 18 0 0 0 5 5l3-3 5 3-1 4c-.2.8-1 1-2 1C10 20 4 14 3 6c0-1 .2-1.8 1-2l4-1Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
};
export function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${iconPaths[name] || iconPaths.compass}</svg>`; }
const base = (route) => route ? '../'.repeat(route.split('/').length) : './';
export const link = (route, target = '') => `${base(route)}${target ? `${target}/` : ''}index.html`;
const asset = (route, name) => `${base(route)}assets/${name}`;
function button(route, target, label, secondary = false, extra = '') {
  return `<a class="button${secondary ? ' button-secondary' : ''}" href="${link(route, target)}${extra}">${label}${arrow}</a>`;
}
function topicButton(route, topic, label = 'Porozmawiajmy o współpracy') {
  return button(route, 'kontakt', label, false, `?temat=${encodeURIComponent(topic)}`);
}
function tag(text, light = false) { return `<p class="eyebrow${light ? ' eyebrow-light' : ''}">${text}</p>`; }
const sectionLabel = (_number, text) => `<p class="section-label">${text}</p>`;


function breadcrumbs(route, title, service = false) {
  return `<nav class="breadcrumbs wrap" aria-label="Ścieżka nawigacji"><ol><li><a href="${link(route)}">Strona główna</a></li>${service ? `<li><a href="${link(route, 'oferta')}">Oferta</a></li>` : ''}<li aria-current="page">${escape(title)}</li></ol></nav>`;
}
function pageIntro(route, { eyebrow, heading, emphasis, intro, title }, service = false) {
  return `${breadcrumbs(route, title, service)}<section class="page-intro wrap">${tag(eyebrow)}<h1>${heading}<br><span>${emphasis}</span></h1><p class="lead">${intro}</p></section>`;
}
function serviceRows(route) {
  return `<div class="service-list">${services.map((s) => `<a class="service-row" href="${link(route, s.path)}"><span class="service-number">${s.number}</span><div><h3>${s.title}</h3><p>${s.description}</p></div><span class="service-row-link">Poznaj usługę ${arrow}</span></a>`).join('')}</div>`;
}

function faq(items) {
  return `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}<span class="faq-plus" aria-hidden="true"></span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div>`;
}
function cta(route, options = {}) {
  return `<section class="contact-band"><div class="wrap contact-band-inner"><div>${tag('Kontakt')}<h2>Porozmawiajmy o Twoim dealerstwie.</h2><p>Opisz sytuację i obszar, który wymaga wsparcia. Ustalimy zakres współpracy.</p></div><div class="contact-band-actions">${topicButton(route, options.topic || '', 'Skontaktuj się')}<a class="contact-band-phone" href="tel:${company.phoneHref}">${company.phone}</a></div></div></section>`;
}

function header(route) {
  const navItems = [['o-firmie', 'Andrzej Sadowski'], ['oferta', 'Oferta'], ['oferta/program-rozwoju-dealera', 'Program rozwoju'], ['klienci', 'Klienci']];
  return `<a class="skip-link" href="#main">Przejdź do treści</a><header class="site-header"><div class="wrap header-inner"><a href="${link(route)}" class="brand" aria-label="A.S. Consulting — strona główna"><span class="brand-wordmark">A.S. CONSULTING</span><span class="brand-subline">ANDRZEJ SADOWSKI</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-label">Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="site-nav" class="site-nav" aria-label="Nawigacja główna">${navItems.map(([target, label]) => `<a href="${link(route, target)}"${route === target ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<a class="nav-cta" href="${link(route, 'kontakt')}"${route === 'kontakt' ? ' aria-current="page"' : ''}>Kontakt ${arrow}</a></nav></div></header>`;
}

function footer(route) {
  return `<footer class="site-footer"><div class="wrap footer-top"><div class="footer-brand"><a href="${link(route)}" class="brand" aria-label="A.S. Consulting — strona główna"><span class="brand-wordmark">A.S. CONSULTING</span><span class="brand-subline">ANDRZEJ SADOWSKI</span></a><p>Doradztwo dla branży motoryzacyjnej.<br>Rozwój dealerstw od 2005 roku.</p></div><nav aria-label="Strony w stopce"><h2>Firma</h2><a href="${link(route, 'o-firmie')}">Andrzej Sadowski</a><a href="${link(route, 'klienci')}">Klienci</a><a href="${link(route, 'kontakt')}">Kontakt</a></nav><nav aria-label="Usługi w stopce"><h2>Oferta</h2>${services.map((s) => `<a href="${link(route, s.path)}">${s.title}</a>`).join('')}</nav><div class="footer-contact"><h2>Kontakt bezpośredni</h2><a href="tel:${company.phoneHref}">${company.phone}</a><a href="mailto:${company.email}">${company.email}</a></div></div><div class="wrap footer-bottom"><span>A.S. Consulting · Andrzej Sadowski</span><a href="#top">Do góry <span aria-hidden="true">↑</span></a></div></footer>`;
}

export function layout(page) {
  const { route = '', title, description, body } = page;
  return `<!doctype html>
<html lang="pl" id="top">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#171a1e">
  <title>${escape(title)} | A.S. Consulting</title>
  <meta name="description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pl_PL">
  <meta property="og:site_name" content="A.S. Consulting — Andrzej Sadowski">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <link rel="icon" href="${asset(route, 'favicon.svg')}" type="image/svg+xml">
  <link rel="preload" href="${asset(route, 'fonts/barlow-regular.ttf')}" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="${asset(route, 'fonts/saira-regular.ttf')}" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${asset(route, 'styles.css')}">
  <script src="${asset(route, 'site.js')}" defer></script>
</head>
<body data-page="${route || 'home'}">
${header(route)}
<main id="main" tabindex="-1">${body}</main>
${footer(route)}
</body>
</html>`;
}

function home() {
  const route = '';
  return `<section class="hero"><picture class="hero-media"><source srcset="${asset(route,'automotive-960.webp')} 960w, ${asset(route,'automotive-1600.webp')} 1600w" sizes="100vw" type="image/webp"><img src="${asset(route,'automotive.jpg')}" alt="Ilustracyjny detal grafitowego samochodu w hali serwisowej" width="1600" height="900" fetchpriority="high"></picture><div class="hero-shade" aria-hidden="true"></div><div class="wrap hero-inner"><div class="hero-copy">${tag('Doradztwo dla branży motoryzacyjnej')}<h1>Rozwój dealerstwa.<br>W praktyce.</h1><p>Serwis. Części. Zarządzanie.<br>Doświadczenie, które wspiera Twoje decyzje.</p><div class="hero-actions">${button(route, 'oferta', 'Poznaj ofertę')}${button(route,'kontakt','Kontakt',true)}</div></div><div class="hero-bottom"><span>Andrzej Sadowski / A.S. Consulting</span><a href="#oferta">Zakres współpracy <span aria-hidden="true">↓</span></a></div></div></section>
  <nav class="service-nav" aria-label="Szybki wybór usługi"><div class="wrap">${services.map(s=>`<a href="${link(route,s.path)}">${s.title}${arrow}</a>`).join('')}</div></nav>
  <section class="wrap section-pad home-offer" id="oferta"><div class="section-heading">${sectionLabel('','Oferta')}<div><h2>Zarządzanie dealerstwem<br>z perspektywy praktyka.</h2><p>Wspieram właścicieli i kierowników w rozwoju obsługi posprzedażnej. Analizuję organizację pracy, pomagam podejmować decyzje i rozwijać kompetencje zespołu.</p></div></div>${serviceRows(route)}</section>
  <section class="program-section"><div class="wrap program-grid"><div class="program-copy">${tag('Program Rozwoju Dealera',true)}<h2>Od audytu<br>do wdrożenia zmian.</h2><p>Autorski program rozwoju serwisu i działu części. Analiza organizacji, praca z kierownikami i trzy miesiące monitorowania wyników.</p>${button(route,'oferta/program-rozwoju-dealera','Zobacz program')}</div><ol class="program-steps">${services[2].process.map(([title,desc],i)=>`<li><span class="step-index">0${i+1}</span><div><h3>${title}</h3><p>${desc}</p></div></li>`).join('')}</ol></div></section>
  <section class="wrap section-pad experience-section"><div class="experience-heading">${tag('Andrzej Sadowski')}<h2>Doświadczenie<br>po obu stronach biurka.</h2></div><div class="experience-copy"><p>Od sprzedawcy samochodów do dyrektora zarządzającego. Pracowałem w dealerstwach Nissan, Ford i BMW, odpowiadając za sprzedaż, części oraz rozwój organizacji.</p><p>Od 2005 roku prowadzę A.S. Consulting i doradzam firmom z branży motoryzacyjnej.</p><a class="text-link" href="${link(route,'o-firmie')}">Poznaj doświadczenie zawodowe ${arrow}</a></div></section>
  <section class="clients-strip"><div class="wrap"><div><p class="section-label">Historia współpracy</p><a class="text-link" href="${link(route,'klienci')}">Zobacz projekty ${arrow}</a></div><ul aria-label="Wybrane marki z historii współpracy"><li>BMW</li><li>Renault</li><li>Ford</li><li>Toyota</li><li>Nissan</li><li>Honda</li></ul></div></section>${cta(route)}`;
}

function about() {
  const route = 'o-firmie';
  return `${pageIntro(route,{title:'Andrzej Sadowski',eyebrow:'A.S. Consulting',heading:'Andrzej Sadowski.',emphasis:'Praktyka w motoryzacji.',intro:'Doświadczenie od sprzedaży samochodów po zarządzanie dealerstwem. Doradztwo oparte na znajomości codziennej pracy serwisu, działu części i kadry zarządzającej.'})}
  <section class="wrap bio-grid"><div class="career-summary"><p class="section-label">Doświadczenie zawodowe</p><div><strong>1991</strong><p>Początek pracy<br>w branży motoryzacyjnej</p></div><div><strong>2005</strong><p>Rozpoczęcie działalności<br>A.S. Consulting</p></div></div><div class="bio-copy"><h2>Znajomość całej organizacji.</h2><p>Moja droga zawodowa prowadziła od sprzedaży samochodów, przez kierowanie zakładem dealerskim i działem części, po stanowisko dyrektora zarządzającego.</p><p>Praca w organizacjach związanych z grupami Sumitomo oraz Bawaria–PGA pozwoliła mi analizować różne modele działania dealerów. Szczególną uwagę poświęcam jakości, dostępności i efektywności pracy.</p><p>W ramach A.S. Consulting opracowałem autorski Program Rozwoju Dealera. Jego podstawą jest analiza działów obsługi posprzedażnej, rozwój kompetencji kierowników i monitorowanie wdrażanych zmian.</p><a class="text-link" href="${link(route,'oferta/program-rozwoju-dealera')}">Program Rozwoju Dealera ${arrow}</a></div></section>
  <section class="wrap section-pad"><div class="section-heading">${sectionLabel('','Przebieg kariery')}<div><h2>Stanowiska i odpowiedzialność.</h2></div></div><ol class="career-list">${career.map(([year,name,role,desc])=>`<li><span class="career-year">${year}</span><div><h3>${name}</h3><p class="career-role">${role}</p></div><p>${desc}</p></li>`).join('')}</ol></section>${cta(route)}`;
}

function offer() {
  const route='oferta';
  return `${pageIntro(route,{title:'Oferta',eyebrow:'Zakres współpracy',heading:'Doradztwo. Audyty.',emphasis:'Rozwój kompetencji.',intro:'Wsparcie dla właścicieli dealerstw, kadry zarządzającej i sieci dealerskich. Wybierz obszar, którego dotyczy Twoje wyzwanie.'})}
  <section class="wrap offer-cards" aria-label="Usługi">${services.map(s=>`<article class="offer-card"><span class="service-number">${s.number}</span><div><h2><a href="${link(route,s.path)}">${s.title}</a></h2><p>${s.description}</p><p class="offer-audience"><strong>Dla kogo</strong>${s.audience}</p><a class="text-link" href="${link(route,s.path)}">Zakres i przebieg współpracy<span class="sr-only">: ${s.title}</span> ${arrow}</a></div></article>`).join('')}</section>
  <section class="wrap section-pad"><div class="section-heading">${sectionLabel('','Wybór usługi')}<div><h2>Od jakiego zagadnienia zaczynamy?</h2></div></div><div class="decision-list">${[
    ['Weryfikacja standardów w sieci dealerskiej.','audyty','Audyty'],
    ['Strategia, budżet lub konkretna decyzja biznesowa.','doradztwo','Doradztwo'],
    ['Organizacja i efektywność obsługi posprzedażnej.','program-rozwoju-dealera','Program Rozwoju Dealera'],
    ['Kompetencje kierowników serwisu i działu części.','szkolenia','Szkolenia'],
  ].map(([q,id,desc])=>`<a href="${link(route,`oferta/${id}`)}"><h3>${q}</h3><span>${desc}</span>${arrow}</a>`).join('')}</div></section>${cta(route)}`;
}

function servicePage(s) {
  const route = s.path;
  const related = services.find((item) => item.id === s.next);
  return `${breadcrumbs(route, s.title, true)}<section class="wrap service-hero"><div>${tag(s.eyebrow)}<h1>${s.heading}<br><span>${s.emphasis}</span></h1><p class="lead">${s.intro}</p>${topicButton(route, s.title, 'Porozmawiajmy o tym')}</div><aside class="service-brief"><div class="service-brief-top"><span>${s.number} / 04</span>${icon(s.icon)}</div><div><h2>Dla kogo</h2><p>${s.audience}</p></div><div><h2>Co wnosi współpraca</h2><p>${s.result}</p></div><a href="#zakres">Zobacz zakres ${arrow}</a></aside></section>
  <section class="wrap section-pad service-scope" id="zakres"><div class="section-heading">${sectionLabel('01', 'Zakres współpracy')}<div><h2>${s.openingTitle}</h2><p>${s.opening}</p></div></div><div class="scope-grid">${s.areas.map(([title, text], i) => `<article><span class="scope-index">0${i + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  ${s.id === 'szkolenia' ? trainingPrograms() : ''}
  <section class="process-section"><div class="wrap"><div class="section-heading">${sectionLabel('02', 'Przebieg współpracy')}<div><h2>${s.id === 'program-rozwoju-dealera' ? 'Cztery etapy programu.' : 'Przebieg współpracy.'}</h2></div></div><ol class="process-grid ${s.process.length === 4 ? 'process-four' : ''}">${s.process.map(([title, text], i) => `<li><span class="process-number">0${i + 1}</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>${s.id === 'program-rozwoju-dealera' ? '<div class="monitor-note"><strong>3 miesiące monitoringu</strong><p>Cotygodniowe dane. Comiesięczne spotkania. Stały punkt odniesienia dla kierowników.</p></div>' : ''}</div></section>
  <section class="wrap faq-section"><div>${sectionLabel('03', 'Pytania i odpowiedzi')}<h2>Pytania i odpowiedzi.</h2></div>${faq(s.faq)}</section>
  <section class="wrap related-section"><span class="eyebrow">Spójrz również na</span><a href="${link(route, related.path)}"><div><h2>${related.title}</h2><p>${related.description}</p></div><span class="round-arrow">${diagonal}</span></a></section>${cta(route, { topic: s.title })}`;
}

function trainingPrograms() {
  return `<section class="wrap training-section"><h2>Programy szkoleń.</h2><div class="training-grid"><article><p class="eyebrow">Program szkolenia / 01</p><h3>Zarządzanie serwisem mechanicznym</h3><ul class="check-list"><li>Pojęcia i definicje</li><li>Zarządzanie biurem obsługi klienta</li><li>Zarządzanie warsztatem</li><li>Współpraca serwisu i działu części</li><li>Monitoring — kluczowe parametry pracy (KPI)</li></ul></article><article><p class="eyebrow">Program szkolenia / 02</p><h3>Zarządzanie działem części zamiennych</h3><ul class="check-list"><li>Pojęcia i definicje</li><li>Zarządzanie magazynem</li><li>Zarządzanie sprzedażą wewnętrzną</li><li>Sprzedaż zewnętrzna i hurtowa</li><li>Monitoring — kluczowe parametry pracy (KPI)</li></ul></article></div></section>`;
}

function clientsPage() {
  const route='klienci';
  return `${pageIntro(route,{title:'Klienci',eyebrow:'Historia współpracy',heading:'Doświadczenie',emphasis:'w sieciach dealerskich.',intro:'Wybrane projekty szkoleniowe i audytowe dla marek samochodów osobowych oraz użytkowych.'})}
  <section class="wrap clients-table-section" aria-label="Wybrane projekty"><div class="clients-table-head" aria-hidden="true"><span>Marka / organizacja</span><span>Zakres projektu</span><span>Okres</span></div><div class="clients-grid">${clients.map(c=>`<article class="client-card"><h2>${c.name}</h2><div><h3>${c.field}</h3><p>${c.text}</p></div><span class="client-period">${c.period}</span></article>`).join('')}</div></section>
  <section class="wrap independent-section"><h2>Niezależne firmy i dystrybutorzy.</h2><p>Doświadczenie obejmuje również niezależne firmy sprzedaży i obsługi samochodów oraz dystrybutorów części zamiennych.</p><a class="text-link" href="${link(route,'oferta')}">Zobacz ofertę ${arrow}</a></section>${cta(route)}`;
}

function contact() {
  const route = 'kontakt';
  return `${pageIntro(route, { title: 'Kontakt', eyebrow: 'A.S. Consulting', heading: 'Kontakt.', emphasis: 'Andrzej Sadowski.', intro: 'Skontaktuj się bezpośrednio lub przygotuj wiadomość dotyczącą swojego dealerstwa. Zakres współpracy ustalamy indywidualnie.' })}
  <section class="wrap contact-grid"><div class="contact-direct"><p class="section-label"><span>01</span>Bezpośrednio do mnie</p><h2>Andrzej Sadowski</h2><p class="contact-role">A.S. Consulting</p><a class="contact-channel" href="tel:${company.phoneHref}"><span>${icon('phone')}</span><span><small>Zadzwoń</small><strong>${company.phone}</strong></span>${diagonal}</a><a class="contact-channel" href="mailto:${company.email}"><span>${icon('mail')}</span><span><small>Napisz</small><strong>${company.email}</strong></span>${diagonal}</a><div class="contact-tip"><span class="small-cross" aria-hidden="true">+</span><h3>Pierwsza rozmowa</h3><p>Wystarczy kilka zdań o Twojej firmie, obecnej sytuacji i tym, co chcesz poprawić.</p></div></div>
  <div class="contact-compose"><p class="section-label"><span>02</span>Przygotuj wiadomość</p><h2>Temat współpracy</h2><p>Przygotuj treść, a następnie otwórz ją w swojej poczcie lub skopiuj. Wiadomość wyślesz samodzielnie.</p><noscript><p class="notice">Aby skorzystać z kreatora wiadomości, włącz JavaScript. Możesz też napisać bezpośrednio na <a href="mailto:${company.email}">${company.email}</a>.</p></noscript>
  <form id="contact-form" class="contact-form" hidden><div id="form-errors" class="form-errors" tabindex="-1" hidden><p>Sprawdź zaznaczone pola:</p><ul></ul></div><div class="form-row"><div class="form-field"><label for="name">Imię i nazwisko <span>(wymagane)</span></label><input id="name" name="name" autocomplete="name" required maxlength="100" aria-describedby="name-error"><span class="field-error" id="name-error"></span></div><div class="form-field"><label for="email">Adres e-mail <span>(wymagany)</span></label><input id="email" name="email" type="email" autocomplete="email" required maxlength="160" aria-describedby="email-error"><span class="field-error" id="email-error"></span></div></div><div class="form-field"><label for="company">Firma <span>(opcjonalnie)</span></label><input id="company" name="company" autocomplete="organization" maxlength="160"></div><div class="form-field"><label for="topic">Temat rozmowy</label><select id="topic" name="topic"><option value="Rozmowa o współpracy">Chcę porozmawiać o możliwościach</option>${services.map((s) => `<option value="${s.title}">${s.title}</option>`).join('')}</select></div><div class="form-field"><label for="message">Twoja sytuacja <span>(wymagane)</span></label><textarea id="message" name="message" rows="5" required minlength="10" maxlength="2000" aria-describedby="message-hint message-error" placeholder="Co chcesz poprawić? Z jakim wyzwaniem mierzy się Twoja firma?"></textarea><div class="field-meta"><span id="message-hint">Wystarczy kilka zdań (minimum 10 znaków).</span><span id="message-count">0 / 2000</span></div><span class="field-error" id="message-error"></span></div><button class="button" type="submit">Przygotuj wiadomość ${arrow}</button><p class="form-note">Przygotowanie treści nie wysyła wiadomości.</p></form>
  <section id="message-preview" class="message-preview" hidden aria-labelledby="preview-heading"><p class="eyebrow">Treść jest gotowa</p><h3 id="preview-heading" tabindex="-1">Wiadomość gotowa do wysłania.</h3><p>Otwórz wiadomość w aplikacji pocztowej i wyślij ją albo skopiuj treść do swojej poczty.</p><label for="draft">Podgląd wiadomości</label><textarea id="draft" rows="9" readonly></textarea><div class="preview-actions"><a id="open-email" class="button" href="mailto:${company.email}">Otwórz pocztę ${diagonal}</a><button id="copy-message" class="button button-secondary" type="button">Kopiuj treść</button></div><p id="copy-status" class="copy-status" role="status" aria-live="polite"></p><button id="edit-message" class="text-link" type="button">Wróć do edycji ${arrow}</button></section></div></section>
  <section class="wrap contact-next"><h2>Co warto zawrzeć w wiadomości?</h2><ol><li><span>01</span><h3>Kilka słów o firmie</h3><p>Typ działalności i dział, którego dotyczy temat.</p></li><li><span>02</span><h3>Obecna sytuacja</h3><p>Najważniejsze wyzwanie lub decyzja do podjęcia.</p></li><li><span>03</span><h3>Twój cel</h3><p>Co chcesz usprawnić, sprawdzić lub rozwinąć.</p></li></ol></section>`;
}

export function pages() {
  return [
    { route: '', title: 'Doradztwo i rozwój dealerstw samochodowych', description: 'Andrzej Sadowski — doradztwo dla dealerów, audyty, szkolenia i Program Rozwoju Dealera. Rozwój serwisu i działu części. A.S. Consulting od 2005 roku.', body: home() },
    { route: 'o-firmie', title: 'Andrzej Sadowski — doświadczenie i podejście', description: 'Poznaj Andrzeja Sadowskiego. Doświadczenie w motoryzacji od 1991 roku: od sprzedaży do zarządzania dealerstwem i własnej praktyki A.S. Consulting.', body: about() },
    { route: 'oferta', title: 'Audyty, doradztwo i szkolenia dla dealerów', description: 'Poznaj cztery obszary współpracy: audyty standardów, doradztwo, Program Rozwoju Dealera i szkolenia z zarządzania serwisem oraz częściami.', body: offer() },
    ...services.map((s) => ({ route: s.path, title: s.title, description: s.intro, body: servicePage(s) })),
    { route: 'klienci', title: 'Klienci i historia współpracy', description: 'Wybrane projekty A.S. Consulting dla sieci BMW, Renault, Ford, Toyota, Nissan, Honda i innych. Szkolenia, audyty i rozwój dealerów.', body: clientsPage() },
    { route: 'kontakt', title: 'Kontakt z Andrzejem Sadowskim', description: 'Porozmawiajmy o rozwoju Twojego dealerstwa. Andrzej Sadowski: +48 601 240 928, andrzej@sadowski-consulting.pl.', body: contact() },
  ];
}

export function notFound() {
  return layout({ route: '', title: 'Nie znaleziono strony', description: 'Wróć do strony głównej A.S. Consulting lub poznaj ofertę doradztwa dla dealerów.', body: `<section class="wrap not-found">${tag('404 · Nie znaleziono strony')}<h1>Wróćmy na<br><span>właściwą drogę.</span></h1><p>Ta strona nie istnieje lub zmieniła adres. Przejdź do strony głównej albo sprawdź ofertę.</p><div class="hero-actions">${button('', '', 'Strona główna')}${button('', 'oferta', 'Poznaj ofertę', true)}</div></section>` });
}
