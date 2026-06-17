import { renderApp } from './render.js';
import { validateForm, scrollToFirstInvalid, collectFormData } from './validation.js';
import {sendToLangdock} from "./langdockConnection.js";

const app = document.querySelector('#app');
app.innerHTML = renderApp();

// Testlink: Felder automatisch befüllen wenn URL test vorhanden
if (new URLSearchParams(window.location.search).has('test')) {
  import('./data.js').then(({ defaultValues }) => {
    // Texteingaben und Textareas
    Object.entries(defaultValues).forEach(([key, value]) => {
      const el = document.querySelector(`[name="${key}"], #${key}`);
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Selects / Dropdowns
    ['insurance', 'shade', 'alloy', 'toothForm', 'type'].forEach(key => {
      const el = document.querySelector(`[name="${key}"]`);
      if (el) {
        el.value = defaultValues[key];
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Radio Buttons (orderType, patientGender)
    ['orderType', 'patientGender'].forEach(key => {
      const radio = document.querySelector(`input[name="${key}"][value="${defaultValues[key]}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
}

const form = document.querySelector('#labForm');
const modalBackdrop = document.querySelector('#modalBackdrop');
const modalMessage = document.querySelector('#modalMessage');
const modalClose = document.querySelector('#modalClose');
const transformBtn = document.querySelector('#transformBtn');

function openModal(message) {
  modalMessage.textContent = message;
  modalBackdrop.hidden = false;
  modalClose.focus({ preventScroll: true });
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalClose.focus({ preventScroll: true });
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) closeModal();
  console.log("Button click");
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const result = validateForm(form);
  if (!result.valid) {
    scrollToFirstInvalid(result.invalidFields);
    openModal('Bitte alle Pflichtfelder ausfüllen.');
    return;
  }

  const payload = collectFormData(form);
  console.log('Transformieren simuliert:', payload);

  transformBtn.classList.add('is-loading');
  transformBtn.textContent = 'Verarbeite…';

  try {
    await sendToLangdock(payload);
    openModal('Formular geprüft und an Langdock gesendet.');
  } catch (err) {
    console.error(err);
    openModal('Senden fehlgeschlagen. Bitte später erneut versuchen.');
  } finally {
    transformBtn.classList.remove('is-loading');
    transformBtn.textContent = 'Absenden';
  }
});

form.addEventListener('input', (event) => {
  const target = event.target;
  const field = target.closest('.field');
  if (!field) return;
  if (target.matches('[data-required="true"]') && target.value.trim() !== '') {
    field.classList.remove('is-invalid');
  }
});

form.addEventListener('change', (event) => {
  const target = event.target;
  const field = target.closest('.field');
  if (!field) return;
  if (target.matches('[data-required="true"]') && target.value.trim() !== '') {
    field.classList.remove('is-invalid');
  }
});