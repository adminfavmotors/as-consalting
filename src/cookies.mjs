import { getConsentConfig } from './consent-config.mjs';

export function cookiesPage() {
  const { enabled } = getConsentConfig();
  return {
    route: 'cookies', title: 'Cookies i ustawienia prywatności',
    description: 'Informacje o cookies, dobrowolnej statystyce Google Analytics i zmianie zgody za pomocą Cookiebot na stronie A.S. Consulting.',
    body: `<nav class="breadcrumbs wrap" aria-label="Ścieżka nawigacji"><ol><li><a href="/">Strona główna</a></li><li aria-current="page">Cookies</li></ol></nav>
      <header class="wrap page-intro privacy-intro"><p class="eyebrow">Twój wybór</p><h1>Cookies i prywatność.</h1><p class="lead">Samodzielnie decydujesz, czy pozwolić na statystyki odwiedzin. Odmowa nie ogranicza dostępu do oferty ani kontaktu.</p></header>
      <div class="wrap cookies-layout"><article class="privacy-copy" aria-label="Informacje o cookies">
        <section id="ustawienia"><h2>Ustawienia cookies</h2>
          <p>Cookiebot umożliwia przyjęcie, odrzucenie lub wybór kategorii cookies. Możesz wrócić do ustawień w dowolnej chwili przez link w stopce.</p>
          <p data-cookie-status role="status" aria-live="polite">${enabled ? 'Bez zgody na statystyki Google Analytics pozostaje wyłączony. Panel wymaga JavaScript i dostępności usługi Cookiebot.' : 'W tej wersji strony analityka i panel cookies nie są aktywne. Google Analytics nie jest ładowany.'}</p>
          ${enabled ? '<a class="button" href="/cookies/#ustawienia" data-cookie-settings>Zmień ustawienia cookies</a>' : ''}
          <noscript><p>JavaScript jest wyłączony. Google Analytics nie działa, a panel Cookiebot nie może się otworzyć.</p></noscript>
        </section>
        <section><h2>Niezbędne</h2><p>Cookiebot zapamiętuje Twój wybór i dokumentuje zgodę. Te informacje służą obsłudze ustawień prywatności. Nie są zgodą na statystyki ani reklamę. Hosting może również korzystać z mechanizmów potrzebnych do bezpiecznego dostarczenia strony.</p></section>
        <section><h2>Statystyczne — tylko za zgodą</h2><p>Po włączeniu analityki i wyrażeniu zgody Google Analytics 4 pomaga ustalić, które strony są odwiedzane. Wykorzystuje identyfikatory cookies, informacje o odsłonach oraz dane techniczne przeglądarki i urządzenia.</p><p>Podstawą jest zgoda — art. 6 ust. 1 lit. a RODO. Przed zgodą nie ładujemy tagu Google. Parametry adresu URL, fragment po znaku # i treść formularza nie są przekazywane przez nasz kod analityczny.</p><p>Nie uruchamiamy Google Ads ani funkcji reklamowej personalizacji. Reklamowe sygnały zgody pozostają wyłączone.</p></section>
        <section><h2>Wycofanie zgody</h2><p>Otwórz ustawienia, wyłącz kategorię „Statystyka” i zapisz wybór. Zatrzymamy dalsze zbieranie danych przez tag GA4 oraz usuniemy dostępne dla strony cookies Google Analytics. Wycofanie zgody nie wpływa na zgodność z prawem wcześniejszego przetwarzania i nie usuwa automatycznie danych już przesłanych do Google.</p><p>Informacje o Twoich prawach i kontakcie z administratorem znajdziesz w <a href="/polityka-prywatnosci/">polityce prywatności</a>.</p></section>
        <section><h2>Czas przechowywania i dostawcy</h2><p>Konfiguracja tagu ogranicza cookies <code>_ga</code> i <code>_ga_…</code> do 365 dni, bez odnawiania terminu przy każdym pomiarze. Okres przechowywania zdarzeń w usłudze Google Analytics jest odrębnym ustawieniem konta.</p><p>Panel zgody dostarcza Cookiebot by Usercentrics, a analitykę Google. Dostawcy mogą przetwarzać dane w swojej infrastrukturze, również poza EOG. Szczegóły: <a href="https://www.cookiebot.com/en/privacy-policy/">Cookiebot — prywatność</a>, <a href="https://policies.google.com/technologies/partner-sites?hl=pl">Google — dane z witryn partnerów</a>.</p></section>
        <section id="wykaz"><h2>Wykaz cookies</h2><p>Po skonfigurowaniu domeny i przeskanowaniu jej przez Cookiebot poniżej dostępne będą nazwy, dostawcy, cele i okresy działania wykrytych cookies.</p><div data-cookie-declaration>${enabled ? '' : '<p>Wykaz nie jest jeszcze aktywny.</p>'}</div></section>
      </article></div>`,
  };
}
