import { company } from './content.mjs';

// Draft: business practices must be confirmed against docs/PRIVACY-REVIEW.md.
export const privacySections = [
  ['administrator', 'Administrator i kontakt', `
    <p>Administratorem danych związanych z obsługą zapytań jest Andrzej Sadowski, prowadzący działalność pod nazwą A.S. CONSULTING Andrzej Sadowski.</p>
    <p>W sprawach prywatności i realizacji swoich praw napisz na <a href="mailto:${company.email}">${company.email}</a>. Możesz również skontaktować się telefonicznie: <a href="tel:${company.phoneHref}">${company.phone}</a>.</p>`],
  ['zakres', 'Jakie dane przetwarzamy', `
    <p>Gdy się z nami kontaktujesz, przetwarzamy dane, które przekazujesz: imię i nazwisko, adres e-mail, ewentualnie nazwę firmy, numer telefonu oraz treść korespondencji. Prosimy o podawanie wyłącznie informacji potrzebnych do omówienia sprawy.</p>
    <p>Podanie danych jest dobrowolne. Bez danych kontaktowych odpowiedź może być niemożliwa. Przeglądanie oferty nie wymaga wypełniania formularza.</p>
    <p>Podczas odwiedzania strony infrastruktura hostingowa może przetwarzać dane techniczne, takie jak adres IP, czas żądania, odwiedzany adres i informacje o przeglądarce.</p>`],
  ['kreator', 'Jak działa przygotowanie wiadomości', `
    <p>Kreator na stronie kontaktowej przygotowuje treść w Twojej przeglądarce. Kliknięcie „Przygotuj wiadomość” nie przesyła wpisanych danych do A.S. Consulting ani do serwera strony.</p>
    <p>Opcja „Otwórz pocztę” przekazuje przygotowaną wiadomość do wybranej aplikacji pocztowej. To Ty decydujesz o jej wysłaniu. Przycisk kopiowania zapisuje treść w schowku urządzenia na Twoje polecenie. Po wysłaniu wiadomości jej obsługa odbywa się za pośrednictwem usług pocztowych nadawcy i odbiorcy.</p>
    <p>Kod strony nie zapisuje pól formularza w cookies, localStorage ani sessionStorage. Przeglądarka lub aplikacja pocztowa może niezależnie zachowywać dane zgodnie z Twoimi ustawieniami.</p>`],
  ['cele', 'Cele i podstawy prawne', `
    <ul>
      <li><strong>Odpowiedź na pytania i kontakt z przedstawicielami firm:</strong> art. 6 ust. 1 lit. f RODO — uzasadniony interes polegający na obsłudze korespondencji i kontaktów biznesowych.</li>
      <li><strong>Działania przed zawarciem umowy:</strong> art. 6 ust. 1 lit. b RODO, gdy prosisz o nie jako osoba, która ma być stroną umowy.</li>
      <li><strong>Bezpieczne działanie strony i ochrona przed nadużyciami:</strong> art. 6 ust. 1 lit. f RODO.</li>
      <li><strong>Ustalenie, dochodzenie lub obrona roszczeń:</strong> art. 6 ust. 1 lit. f RODO, wyłącznie w niezbędnym zakresie.</li>
    </ul>
    <p>Obsługa zapytania nie wymaga zgody na marketing. Na stronie nie ma zapisu do newslettera.</p>`],
  ['odbiorcy', 'Odbiorcy danych i hosting', `
    <p>Do danych mogą mieć dostęp dostawcy poczty elektronicznej, hostingu i obsługi technicznej, w zakresie potrzebnym do świadczenia swoich usług, oraz uprawnione organy, jeżeli wymagają tego przepisy.</p>
    <p>Hosting strony zapewnia Vercel Inc. z siedzibą w USA. Nie przekazujemy Vercel treści wpisanych do kreatora przez kod formularza. Vercel może jednak przetwarzać dane techniczne powstające podczas odwiedzania strony.</p>
    <p>Vercel opisuje przetwarzanie danych generowanych przez usługę jako odrębny administrator w swojej <a href="https://vercel.com/legal/privacy-notice">informacji o prywatności</a>. Warunki przetwarzania danych w imieniu klienta opisuje <a href="https://vercel.com/legal/dpa">Data Processing Addendum</a>; jego zastosowanie zależy od zawartej umowy i planu usługi.</p>`],
  ['transfery', 'Przetwarzanie poza EOG', `
    <p>Globalna infrastruktura Vercel może wiązać się z przetwarzaniem danych poza Europejskim Obszarem Gospodarczym, w tym w USA. Vercel opisuje stosowane mechanizmy transferu, w tym EU–US Data Privacy Framework oraz standardowe klauzule umowne, w dokumentach wskazanych powyżej.</p>
    <p>Informacje o zabezpieczeniach dotyczących danych przetwarzanych przez A.S. Consulting oraz sposobie uzyskania ich kopii można uzyskać pod podanym adresem e-mail.</p>`],
  ['przechowywanie', 'Jak długo przechowujemy dane', `
    <p>Korespondencję dotyczącą zapytania przechowujemy przez czas jego obsługi: do udzielenia odpowiedzi i zakończenia dalszych uzgodnień dotyczących tej sprawy. Jeżeli rozmowa prowadzi do współpracy, dane potrzebne do jej realizacji przechowujemy przez czas wykonywania umowy.</p>
    <p>Dane potrzebne do udokumentowania roszczeń mogą być przechowywane do upływu właściwego terminu przedawnienia, a w razie sporu — do jego prawomocnego zakończenia. Dokumenty podlegające obowiązkowi przechowywania zachowujemy przez okres wynikający z odpowiednich przepisów.</p>
    <p>Dane techniczne przechowywane przez Vercel podlegają zasadom retencji opisanym w jego informacji o prywatności. Okresy zależą od rodzaju danych i usług. Nie stosujemy jednego wspólnego terminu do korespondencji i danych infrastruktury.</p>`],
  ['prawa', 'Twoje prawa', `
    <p>Na warunkach określonych w RODO możesz żądać dostępu do swoich danych, ich sprostowania, usunięcia i ograniczenia przetwarzania. Prawo do przenoszenia danych przysługuje w przypadkach przewidzianych dla przetwarzania automatycznego opartego na zgodzie lub umowie.</p>
    <p><strong>Możesz wnieść sprzeciw</strong> wobec przetwarzania opartego na uzasadnionym interesie z przyczyn związanych z Twoją szczególną sytuacją.</p>
    <p>Żądanie prześlij na <a href="mailto:${company.email}">${company.email}</a>. Masz również prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych — <a href="https://uodo.gov.pl/">uodo.gov.pl</a>.</p>`],
  ['cookies', 'Cookies, analityka i profilowanie', `
    <p>W kodzie tej strony nie stosujemy cookies analitycznych lub reklamowych, pikseli marketingowych ani narzędzi do nagrywania sesji. Pliki czcionek i zdjęć są dostarczane razem ze stroną, bez pobierania ich z zewnętrznych serwisów.</p>
    <p>W A.S. Consulting nie podejmujemy na podstawie korzystania z tej strony decyzji wywołujących skutki prawne lub podobnie istotnie wpływających na Ciebie w sposób wyłącznie zautomatyzowany; nie prowadzimy profilowania marketingowego odwiedzających.</p>
    <p>Zmiany funkcji strony lub sposobu przetwarzania danych wymagają aktualizacji tej informacji.</p>`],
];

export function privacyPage() {
  return {
    route: 'polityka-prywatnosci',
    title: 'Polityka prywatności',
    description: 'Informacje o danych osobowych, kontakcie, działaniu kreatora wiadomości i hostingu strony A.S. Consulting Andrzej Sadowski.',
    robots: 'noindex, nofollow',
    body: `<nav class="breadcrumbs wrap" aria-label="Ścieżka nawigacji"><ol><li><a href="/">Strona główna</a></li><li aria-current="page">Polityka prywatności</li></ol></nav>
      <header class="wrap page-intro privacy-intro"><p class="eyebrow">A.S. Consulting</p><h1>Polityka prywatności.</h1><p class="lead">Informacje o danych osobowych podczas korzystania ze strony i kontaktu z Andrzejem Sadowskim.</p></header>
      <div class="wrap privacy-layout">
        <nav class="privacy-toc" aria-label="Spis treści polityki prywatności"><p class="section-label">Spis treści</p><ol>${privacySections.map(([id, title]) => `<li><a href="#${id}">${title}</a></li>`).join('')}</ol></nav>
        <article class="privacy-copy" aria-label="Treść polityki prywatności">
          <aside class="privacy-draft" aria-label="Status dokumentu"><strong>Projekt do weryfikacji</strong><p>Przed przyjęciem dokumentu administrator powinien potwierdzić zasady przechowywania korespondencji, dostawcę poczty oraz warunki hostingu i transferów danych. Ten projekt nie jest zatwierdzoną polityką.</p></aside>
          ${privacySections.map(([id, title, content], index) => `<section id="${id}"><h2>${index + 1}. ${title}</h2>${content}</section>`).join('')}
        </article>
      </div>`,
  };
}
