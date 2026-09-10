import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../src/templates.mjs', import.meta.url);
let text = await readFile(path, 'utf8');
function replaceFunction(name, replacement) {
  const start = text.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Missing function ${name}`);
  const next = text.indexOf('\nfunction ', start + 1);
  const nextExport = text.indexOf('\nexport function ', start + 1);
  const ends = [next, nextExport].filter((n) => n > start);
  const end = Math.min(...ends);
  text = text.slice(0, start) + replacement + '\n' + text.slice(end);
}

replaceFunction('tag', `function tag(text, light = false) { return \`<p class="eyebrow\${light ? ' eyebrow-light' : ''}">\${text}</p>\`; }
const sectionLabel = (_number, text) => \`<p class="section-label">\${text}</p>\`;
`);
// Remove the former numbered decorative label function, now replaced above.
const oldLabel = text.indexOf('\nfunction sectionLabel(');
if (oldLabel !== -1) {
  const end = text.indexOf('\nfunction ', oldLabel + 1);
  text = text.slice(0, oldLabel) + text.slice(end);
}

replaceFunction('serviceRows', `function serviceRows(route) {
  return \`<div class="service-list">\${services.map((s) => \`<a class="service-row" href="\${link(route, s.path)}"><span class="service-number">\${s.number}</span><div><h3>\${s.title}</h3><p>\${s.description}</p></div><span class="service-row-link">Poznaj usługę \${arrow}</span></a>\`).join('')}</div>\`;
}`);

replaceFunction('cta', `function cta(route, options = {}) {
  return \`<section class="contact-band"><div class="wrap contact-band-inner"><div>\${tag('Kontakt')}<h2>Porozmawiajmy o Twoim dealerstwie.</h2><p>Opisz sytuację i obszar, który wymaga wsparcia. Ustalimy zakres współpracy.</p></div><div class="contact-band-actions">\${topicButton(route, options.topic || '', 'Skontaktuj się')}<a class="contact-band-phone" href="tel:\${company.phoneHref}">\${company.phone}</a></div></div></section>\`;
}`);

replaceFunction('header', `function header(route) {
  const navItems = [['o-firmie', 'Andrzej Sadowski'], ['oferta', 'Oferta'], ['oferta/program-rozwoju-dealera', 'Program rozwoju'], ['klienci', 'Klienci']];
  return \`<a class="skip-link" href="#main">Przejdź do treści</a><header class="site-header"><div class="wrap header-inner"><a href="\${link(route)}" class="brand" aria-label="A.S. Consulting — strona główna"><span class="brand-wordmark">A.S. CONSULTING</span><span class="brand-subline">ANDRZEJ SADOWSKI</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-label">Menu</span><span class="menu-lines" aria-hidden="true"></span></button><nav id="site-nav" class="site-nav" aria-label="Nawigacja główna">\${navItems.map(([target, label]) => \`<a href="\${link(route, target)}"\${route === target ? ' aria-current="page"' : ''}>\${label}</a>\`).join('')}<a class="nav-cta" href="\${link(route, 'kontakt')}"\${route === 'kontakt' ? ' aria-current="page"' : ''}>Kontakt \${arrow}</a></nav></div></header>\`;
}`);

replaceFunction('footer', `function footer(route) {
  return \`<footer class="site-footer"><div class="wrap footer-top"><div class="footer-brand"><a href="\${link(route)}" class="brand" aria-label="A.S. Consulting — strona główna"><span class="brand-wordmark">A.S. CONSULTING</span><span class="brand-subline">ANDRZEJ SADOWSKI</span></a><p>Doradztwo dla branży motoryzacyjnej.<br>Rozwój dealerstw od 2005 roku.</p></div><nav aria-label="Strony w stopce"><h2>Firma</h2><a href="\${link(route, 'o-firmie')}">Andrzej Sadowski</a><a href="\${link(route, 'klienci')}">Klienci</a><a href="\${link(route, 'kontakt')}">Kontakt</a></nav><nav aria-label="Usługi w stopce"><h2>Oferta</h2>\${services.map((s) => \`<a href="\${link(route, s.path)}">\${s.title}</a>\`).join('')}</nav><div class="footer-contact"><h2>Kontakt bezpośredni</h2><a href="tel:\${company.phoneHref}">\${company.phone}</a><a href="mailto:\${company.email}">\${company.email}</a></div></div><div class="wrap footer-bottom"><span>A.S. Consulting · Andrzej Sadowski</span><a href="#top">Do góry <span aria-hidden="true">↑</span></a></div></footer>\`;
}`);

replaceFunction('home', `function home() {
  const route = '';
  return \`<section class="hero"><picture class="hero-media"><source srcset="\${asset(route,'automotive-960.webp')} 960w, \${asset(route,'automotive-1920.webp')} 1920w" sizes="100vw" type="image/webp"><img src="\${asset(route,'automotive.jpg')}" alt="Ilustracyjny detal grafitowego samochodu w hali serwisowej" width="1920" height="1080" fetchpriority="high"></picture><div class="hero-shade" aria-hidden="true"></div><div class="wrap hero-inner"><div class="hero-copy">\${tag('Doradztwo dla branży motoryzacyjnej')}<h1>Rozwój dealerstwa.<br>W praktyce.</h1><p>Serwis. Części. Zarządzanie.<br>Doświadczenie, które wspiera Twoje decyzje.</p><div class="hero-actions">\${button(route, 'oferta', 'Poznaj ofertę')}\${button(route,'kontakt','Kontakt',true)}</div></div><div class="hero-bottom"><span>Andrzej Sadowski / A.S. Consulting</span><a href="#oferta">Zakres współpracy <span aria-hidden="true">↓</span></a></div></div></section>
  <nav class="service-nav" aria-label="Szybki wybór usługi"><div class="wrap">\${services.map(s=>\`<a href="\${link(route,s.path)}">\${s.title}\${arrow}</a>\`).join('')}</div></nav>
  <section class="wrap section-pad home-offer" id="oferta"><div class="section-heading">\${sectionLabel('','Oferta')}<div><h2>Zarządzanie dealerstwem<br>z perspektywy praktyka.</h2><p>Wspieram właścicieli i kierowników w rozwoju obsługi posprzedażnej. Analizuję organizację pracy, pomagam podejmować decyzje i rozwijać kompetencje zespołu.</p></div></div>\${serviceRows(route)}</section>
  <section class="program-section"><div class="wrap program-grid"><div class="program-copy">\${tag('Program Rozwoju Dealera',true)}<h2>Od audytu<br>do wdrożenia zmian.</h2><p>Autorski program rozwoju serwisu i działu części. Analiza organizacji, praca z kierownikami i trzy miesiące monitorowania wyników.</p>\${button(route,'oferta/program-rozwoju-dealera','Zobacz program')}</div><ol class="program-steps">\${services[2].process.map(([title,desc],i)=>\`<li><span class="step-index">0\${i+1}</span><div><h3>\${title}</h3><p>\${desc}</p></div></li>\`).join('')}</ol></div></section>
  <section class="wrap section-pad experience-section"><div class="experience-heading">\${tag('Andrzej Sadowski')}<h2>Doświadczenie<br>po obu stronach biurka.</h2></div><div class="experience-copy"><p>Od sprzedawcy samochodów do dyrektora zarządzającego. Pracowałem w dealerstwach Nissan, Ford i BMW, odpowiadając za sprzedaż, części oraz rozwój organizacji.</p><p>Od 2005 roku prowadzę A.S. Consulting i doradzam firmom z branży motoryzacyjnej.</p><a class="text-link" href="\${link(route,'o-firmie')}">Poznaj doświadczenie zawodowe \${arrow}</a></div></section>
  <section class="clients-strip"><div class="wrap"><div><p class="section-label">Historia współpracy</p><a class="text-link" href="\${link(route,'klienci')}">Zobacz projekty \${arrow}</a></div><ul aria-label="Wybrane marki z historii współpracy"><li>BMW</li><li>Renault</li><li>Ford</li><li>Toyota</li><li>Nissan</li><li>Honda</li></ul></div></section>\${cta(route)}\`;
}`);

replaceFunction('about', `function about() {
  const route = 'o-firmie';
  return \`\${pageIntro(route,{title:'Andrzej Sadowski',eyebrow:'A.S. Consulting',heading:'Andrzej Sadowski.',emphasis:'Praktyka w motoryzacji.',intro:'Doświadczenie od sprzedaży samochodów po zarządzanie dealerstwem. Doradztwo oparte na znajomości codziennej pracy serwisu, działu części i kadry zarządzającej.'})}
  <section class="wrap bio-grid"><div class="career-summary"><p class="section-label">Doświadczenie zawodowe</p><div><strong>1991</strong><p>Początek pracy<br>w branży motoryzacyjnej</p></div><div><strong>2005</strong><p>Rozpoczęcie działalności<br>A.S. Consulting</p></div></div><div class="bio-copy"><h2>Znajomość całej organizacji.</h2><p>Moja droga zawodowa prowadziła od sprzedaży samochodów, przez kierowanie zakładem dealerskim i działem części, po stanowisko dyrektora zarządzającego.</p><p>Praca w organizacjach związanych z grupami Sumitomo oraz Bawaria–PGA pozwoliła mi analizować różne modele działania dealerów. Szczególną uwagę poświęcam jakości, dostępności i efektywności pracy.</p><p>W ramach A.S. Consulting opracowałem autorski Program Rozwoju Dealera. Jego podstawą jest analiza działów obsługi posprzedażnej, rozwój kompetencji kierowników i monitorowanie wdrażanych zmian.</p><a class="text-link" href="\${link(route,'oferta/program-rozwoju-dealera')}">Program Rozwoju Dealera \${arrow}</a></div></section>
  <section class="wrap section-pad"><div class="section-heading">\${sectionLabel('','Przebieg kariery')}<div><h2>Stanowiska i odpowiedzialność.</h2></div></div><ol class="career-list">\${career.map(([year,name,role,desc])=>\`<li><span class="career-year">\${year}</span><div><h3>\${name}</h3><p class="career-role">\${role}</p></div><p>\${desc}</p></li>\`).join('')}</ol></section>\${cta(route)}\`;
}`);

replaceFunction('offer', `function offer() {
  const route='oferta';
  return \`\${pageIntro(route,{title:'Oferta',eyebrow:'Zakres współpracy',heading:'Doradztwo. Audyty.',emphasis:'Rozwój kompetencji.',intro:'Wsparcie dla właścicieli dealerstw, kadry zarządzającej i sieci dealerskich. Wybierz obszar, którego dotyczy Twoje wyzwanie.'})}
  <section class="wrap offer-cards" aria-label="Usługi">\${services.map(s=>\`<article class="offer-card"><span class="service-number">\${s.number}</span><div><h2><a href="\${link(route,s.path)}">\${s.title}</a></h2><p>\${s.description}</p><p class="offer-audience"><strong>Dla kogo</strong>\${s.audience}</p><a class="text-link" href="\${link(route,s.path)}">Zakres i przebieg współpracy<span class="sr-only">: \${s.title}</span> \${arrow}</a></div></article>\`).join('')}</section>
  <section class="wrap section-pad"><div class="section-heading">\${sectionLabel('','Wybór usługi')}<div><h2>Od jakiego zagadnienia zaczynamy?</h2></div></div><div class="decision-list">\${[
    ['Weryfikacja standardów w sieci dealerskiej.','audyty','Audyty'],
    ['Strategia, budżet lub konkretna decyzja biznesowa.','doradztwo','Doradztwo'],
    ['Organizacja i efektywność obsługi posprzedażnej.','program-rozwoju-dealera','Program Rozwoju Dealera'],
    ['Kompetencje kierowników serwisu i działu części.','szkolenia','Szkolenia'],
  ].map(([q,id,desc])=>\`<a href="\${link(route,\`oferta/\${id}\`)}"><h3>\${q}</h3><span>\${desc}</span>\${arrow}</a>\`).join('')}</div></section>\${cta(route)}\`;
}`);

replaceFunction('clientsPage', `function clientsPage() {
  const route='klienci';
  return \`\${pageIntro(route,{title:'Klienci',eyebrow:'Historia współpracy',heading:'Doświadczenie',emphasis:'w sieciach dealerskich.',intro:'Wybrane projekty szkoleniowe i audytowe dla marek samochodów osobowych oraz użytkowych.'})}
  <section class="wrap clients-table-section" aria-label="Wybrane projekty"><div class="clients-table-head" aria-hidden="true"><span>Marka / organizacja</span><span>Zakres projektu</span><span>Okres</span></div><div class="clients-grid">\${clients.map(c=>\`<article class="client-card"><h2>\${c.name}</h2><div><h3>\${c.field}</h3><p>\${c.text}</p></div><span class="client-period">\${c.period}</span></article>\`).join('')}</div></section>
  <section class="wrap independent-section"><h2>Niezależne firmy i dystrybutorzy.</h2><p>Doświadczenie obejmuje również niezależne firmy sprzedaży i obsługi samochodów oraz dystrybutorów części zamiennych.</p><a class="text-link" href="\${link(route,'oferta')}">Zobacz ofertę \${arrow}</a></section>\${cta(route)}\`;
}`);

text = text
  .replaceAll('fonts/manrope-regular.ttf','fonts/barlow-regular.ttf')
  .replaceAll('fonts/dm-serif-display.ttf','fonts/saira-regular.ttf')
  .replaceAll('#193c36','#171a1e')
  .replaceAll('<em>','<span>').replaceAll('</em>','</span>')
  .replace('heading: \'Dobra zmiana zaczyna się\', emphasis: \'od rozmowy.\'', 'heading: \'Kontakt.\', emphasis: \'Andrzej Sadowski.\'')
  .replace('eyebrow: \'Porozmawiajmy o Twoim dealerstwie\'', 'eyebrow: \'A.S. Consulting\'')
  .replace('Masz konkretny temat lub dopiero szukasz właściwego kierunku? Napisz albo zadzwoń. Zacznijmy od tego, co jest teraz ważne dla Twojej firmy.', 'Skontaktuj się bezpośrednio lub przygotuj wiadomość dotyczącą swojego dealerstwa. Zakres współpracy ustalamy indywidualnie.')
  .replace('Nie potrzebujesz gotowego briefu.', 'Pierwsza rozmowa')
  .replace('Uporządkuj swój temat','Przygotuj wiadomość')
  .replace('O czym porozmawiamy?', 'Temat współpracy')
  .replace('Twój kolejny krok.', 'Wiadomość gotowa do wysłania.')
  .replace('<h2>Dwa działy.<br><span>Dwa praktyczne zakresy.</span></h2>', '<h2>Programy szkoleń.</h2>')
  .replace("${s.id === 'program-rozwoju-dealera' ? 'Od diagnozy do' : 'Jasny cel.'}<br><span>${s.id === 'program-rozwoju-dealera' ? 'codziennej praktyki.' : 'Przemyślany proces.'}</span>", "${s.id === 'program-rozwoju-dealera' ? 'Cztery etapy programu.' : 'Przebieg współpracy.'}")
  .replace('<h2>Warto wiedzieć<br><span>przed rozpoczęciem.</span></h2>', '<h2>Pytania i odpowiedzi.</h2>')
  .replace("title: 'Rozwój dealerstwa zaczyna się od środka'", "title: 'Doradztwo i rozwój dealerstw samochodowych'");
await writeFile(path,text);

const contentPath=new URL('../src/content.mjs',import.meta.url);
let content=await readFile(contentPath,'utf8');
content=content
  .replace("heading: 'Pewność zaczyna się od', emphasis: 'rzetelnej oceny.'", "heading: 'Audyty standardów', emphasis: 'dealerskich.'")
  .replace("heading: 'Dobra strategia rozumie', emphasis: 'Twoje realia.'", "heading: 'Doradztwo dla', emphasis: 'branży motoryzacyjnej.'")
  .replace("heading: 'Rozwój, który zaczyna się', emphasis: 'wewnątrz organizacji.'", "heading: 'Program Rozwoju', emphasis: 'Dealera.'")
  .replace("heading: 'Wiedza, która pracuje', emphasis: 'razem z zespołem.'", "heading: 'Szkolenia dla', emphasis: 'kadry zarządzającej.'")
  .replace("openingTitle: 'Standardy w praktyce, nie tylko na papierze.'", "openingTitle: 'Weryfikacja standardów producenta.'")
  .replace("openingTitle: 'Zanim zdecydujesz, poznaj możliwości.'", "openingTitle: 'Analiza rynku i organizacji dealerstwa.'")
  .replace("openingTitle: 'Silna obsługa posprzedażna buduje całe dealerstwo.'", "openingTitle: 'Organizacja serwisu i działu części.'")
  .replace("openingTitle: 'Od znajomości wskaźników do trafnych decyzji.'", "openingTitle: 'Zarządzanie serwisem i częściami.'");
await writeFile(contentPath,content);
console.log('Rebuilt automotive page structures and copy.');
