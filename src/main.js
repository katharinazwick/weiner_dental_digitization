import { renderApp } from './render.js';
import { validateForm, scrollToFirstInvalid, collectFormData } from './validation.js';

const app = document.querySelector('#app');
app.innerHTML = renderApp();

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

  window.setTimeout(() => {
    transformBtn.classList.remove('is-loading');
    transformBtn.textContent = 'Transformieren';
    //der Button schickt mich erst nach oben und dann bin ich wieder unten, der soll oben bleiben
    openModal('Formular geprüft. Die Transformation wurde erfolgreich simuliert.');
  }, 650);
});


// Visual feedback for invalid states on interaction
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