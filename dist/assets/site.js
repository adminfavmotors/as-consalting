(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const mobile = window.matchMedia('(max-width: 900px)');
  if (toggle && nav) {
    const closeMenu = (restoreFocus = false) => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.menu-label').textContent = 'Menu';
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.menu-label').textContent = open ? 'Zamknij' : 'Menu';
      nav.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('focusin', (event) => {
      if (mobile.matches && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    mobile.addEventListener('change', () => {
      const activeInside = nav.contains(document.activeElement);
      closeMenu(mobile.matches && activeInside);
    });
  }

  const form = document.querySelector('#contact-form');
  if (!form) return;
  // Progressive enhancement: without JS, only the direct contact channels are shown.
  form.hidden = false;
  form.noValidate = true;
  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    company: form.elements.namedItem('company'),
    topic: form.elements.namedItem('topic'),
    message: form.elements.namedItem('message'),
  };
  const preview = document.querySelector('#message-preview');
  const draft = document.querySelector('#draft');
  const errorSummary = document.querySelector('#form-errors');
  const errorList = errorSummary.querySelector('ul');
  const status = document.querySelector('#copy-status');
  const recipient = 'andrzej@sadowski-consulting.pl';
  const requestedTopic = new URLSearchParams(window.location.search).get('temat');
  if ([...fields.topic.options].some((option) => option.value === requestedTopic)) {
    fields.topic.value = requestedTopic;
  }
  const count = document.querySelector('#message-count');
  fields.message.addEventListener('input', () => {
    count.textContent = `${fields.message.value.length} / 2000`;
  });
  const messages = {
    name: 'Podaj imię i nazwisko.',
    email: 'Podaj prawidłowy adres e-mail.',
    message: 'Opisz swoją sytuację w co najmniej 10 znakach.',
  };
  const invalid = (name) => {
    const field = fields[name];
    if (name === 'message') return field.value.trim().length < 10 || field.value.length > 2000;
    return !field.value.trim() || !field.validity.valid;
  };
  const clearError = (name) => {
    fields[name].removeAttribute('aria-invalid');
    document.querySelector(`#${name}-error`).textContent = '';
    errorList.querySelector(`[data-error="${name}"]`)?.remove();
    if (!errorList.children.length) errorSummary.hidden = true;
  };
  for (const name of Object.keys(messages)) {
    fields[name].addEventListener('input', () => {
      if (fields[name].getAttribute('aria-invalid') === 'true' && !invalid(name)) clearError(name);
    });
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorList.replaceChildren();
    let errors = 0;
    for (const name of Object.keys(messages)) {
      if (invalid(name)) {
        errors += 1;
        fields[name].setAttribute('aria-invalid', 'true');
        document.querySelector(`#${name}-error`).textContent = messages[name];
        const item = document.createElement('li');
        item.dataset.error = name;
        const target = document.createElement('a');
        target.href = `#${name}`;
        target.textContent = messages[name];
        target.addEventListener('click', (e) => { e.preventDefault(); fields[name].focus(); });
        item.append(target);
        errorList.append(item);
      } else {
        clearError(name);
      }
    }
    errorSummary.hidden = errors === 0;
    if (errors) {
      errorSummary.focus();
      return;
    }
    const subject = `A.S. Consulting — ${fields.topic.value}`;
    const body = [
      'Dzień dobry Panie Andrzeju,',
      '',
      `Temat: ${fields.topic.value}`,
      ...(fields.company.value.trim() ? [`Firma: ${fields.company.value.trim()}`] : []),
      '',
      fields.message.value.trim(),
      '',
      'Pozdrawiam,',
      fields.name.value.trim(),
      fields.email.value.trim(),
    ].join('\n');
    draft.value = body;
    document.querySelector('#open-email').href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.hidden = true;
    preview.hidden = false;
    status.textContent = '';
    document.querySelector('#preview-heading').focus();
  });
  document.querySelector('#edit-message').addEventListener('click', () => {
    preview.hidden = true;
    form.hidden = false;
    fields.message.focus();
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const text = `Do: ${recipient}\nTemat: A.S. Consulting — ${fields.topic.value}\n\n${draft.value}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      status.textContent = 'Skopiowano treść. Wklej ją do swojej poczty i wyślij wiadomość.';
    } catch {
      // file:// and permission-denied fallback: select visible text for manual copying.
      draft.focus();
      draft.select();
      status.textContent = 'Zaznaczono treść. Użyj Ctrl+C (lub ⌘C), aby ją skopiować, a następnie wklej do swojej poczty.';
    }
  });
})();
