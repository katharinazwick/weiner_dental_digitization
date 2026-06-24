import { renderApp } from './render.js';
import { validateForm, scrollToFirstInvalid, collectFormData } from './validation.js';
import { sendToLangdock } from './langdockConnection.js';
import { defaultValues } from './data.js';

const isTest = new URLSearchParams(window.location.search).has('test');

const app = document.querySelector('#app');

let form, modalBackdrop, modalMessage, modalClose, transformBtn;

function openModal(message) {
  modalMessage.textContent = message;
  modalBackdrop.hidden = false;
  modalClose.focus({ preventScroll: true });
}

function closeModal() {
  modalBackdrop.hidden = true;
  modalClose.focus({ preventScroll: true });
}

function buildValidationMessage(errors = []) {
  if (errors.length === 1 && errors[0] === 'patientIdentifierConflict') {
    return 'Bitte nur eins angeben: entweder Vorname + Nachname oder die Patientennummer.';
  }
  return 'Bitte alle Pflichtfelder ausfüllen.';
}

function render(state) {
  app.innerHTML = renderApp(state);
  bindReferences();
  bindListeners();
}

function bindReferences() {
  form = document.querySelector('#labForm');
  modalBackdrop = document.querySelector('#modalBackdrop');
  modalMessage = document.querySelector('#modalMessage');
  modalClose = document.querySelector('#modalClose');
  transformBtn = document.querySelector('#transformBtn');
}

function bindListeners() {
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
    console.log('Button click');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const result = validateForm(form);
    if (!result.valid) {
      scrollToFirstInvalid(result.invalidFields);
      openModal(buildValidationMessage(result.errors));
      return;
    }

    const payload = collectFormData(form);

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

  // Re-Render bei Wechsel der Antragsart, damit Pflichtfeld-Markierungen
  // (Sternchen, data-required) für Reparatur/Neuantrag korrekt aktualisiert werden.
  form.querySelectorAll('input[name="requestType"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const currentState = collectFormData(form);
      render(currentState);
    });
  });
}

render(isTest ? defaultValues : {});