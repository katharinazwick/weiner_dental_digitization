import { exemptFieldsWhenReparatur } from './data.js';

export function isBlank(value) {
  return value == null || String(value).trim() === '';
}

function clearInvalidState(form) {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

function setInvalid(field) {
  field.classList.add('is-invalid');
  const control = field.querySelector('.control, .segmented');
  if (control) control.setAttribute('aria-invalid', 'true');
}

export function validateForm(form) {
  clearInvalidState(form);

  const requestTypeEl = form.querySelector('input[name="requestType"]:checked');
  const isReparatur = requestTypeEl?.value === 'reparatur';
  const exempt = new Set(exemptFieldsWhenReparatur);

  const invalidFields = [];
  const requiredInputs = form.querySelectorAll('[data-required="true"]');
  requiredInputs.forEach((element) => {
    if (isReparatur && exempt.has(element.id)) return;

    const field = element.closest('.field') || element.closest('label') || element.closest('td') || element.closest('.tooth-cell');
    if (!field) return;

    if (element.tagName === 'SELECT' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (isBlank(element.value)) {
        setInvalid(field);
        invalidFields.push(field);
      }
    }
  });

  const requestTypeGroup = form.querySelector('input[name="requestType"]');
  if (requestTypeGroup) {
    const checked = form.querySelector('input[name="requestType"]:checked');
    const stack = requestTypeGroup.closest('.stack');
    if (!checked && stack) {
      stack.classList.add('is-invalid');
      invalidFields.push(stack);
    } else if (stack) {
      stack.classList.remove('is-invalid');
    }
  }

  const orderTypeGroup = form.querySelector('input[name="orderType"]');
  if (orderTypeGroup) {
    const checked = form.querySelector('input[name="orderType"]:checked');
    const stack = orderTypeGroup.closest('.stack');
    if (!checked && stack) {
      stack.classList.add('is-invalid');
      invalidFields.push(stack);
    } else if (stack) {
      stack.classList.remove('is-invalid');
    }
  }

  const requiredText = [
    form.querySelector('#dentistName'),
    form.querySelector('#practiceName'),
  ];

  requiredText.forEach((el) => {
    if (!el) return;
    const field = el.closest('.field');
    if (isBlank(el.value) && field) {
      setInvalid(field);
      invalidFields.push(field);
    }
  });

  const firstNameEl = form.querySelector('#patientFirstName');
  const lastNameEl = form.querySelector('#patientSecondName');
  const patientNumberEl = form.querySelector('#patientNumber');

  if (firstNameEl && lastNameEl && patientNumberEl) {
    const hasFullName = !isBlank(firstNameEl.value) && !isBlank(lastNameEl.value);
    const hasPatientNumber = !isBlank(patientNumberEl.value);

    if (!hasFullName && !hasPatientNumber) {
      [firstNameEl, lastNameEl, patientNumberEl].forEach((el) => {
        const field = el.closest('.field');
        if (field) {
          setInvalid(field);
          invalidFields.push(field);
        }
      });
    }
  }

  // XML-Nr. ist nur Pflicht bei gesetzlich Versicherten
  const xmlNumberEl = form.querySelector('#xmlNumber');
  const insuranceEl = form.querySelector('#insurance');
  if (xmlNumberEl && insuranceEl) {
    const field = xmlNumberEl.closest('.field');
    const isStatutory = insuranceEl.value === 'gesetzlich';
    if (isStatutory && isBlank(xmlNumberEl.value) && field) {
      setInvalid(field);
      invalidFields.push(field);
    }
  }

  const ageEl = form.querySelector('#patientAge');
  if (ageEl && !(isReparatur && exempt.has('patientAge'))) {
    const field = ageEl.closest('.field');
    const age = Number(ageEl.value);
    if ((isBlank(ageEl.value) || Number.isNaN(age) || age <= 0) && field) {
      setInvalid(field);
      invalidFields.push(field);
    }
  }

  return {
    valid: invalidFields.length === 0,
    invalidFields,
  };
}

export function scrollToFirstInvalid(invalidFields) {
  if (!invalidFields.length) return;
  const first = invalidFields[0];
  first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function collectFormData(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.orderType = form.querySelector('input[name="orderType"]:checked')?.value ?? '';
  data.requestType = form.querySelector('input[name="requestType"]:checked')?.value ?? '';
  data.gesichtsbogen = form.querySelector('#gesichtsbogen')?.checked ?? false;
  data.teeth = {};
  form.querySelectorAll('[data-tooth-cell] select').forEach((select) => {
    const key = select.name.replace('tooth_', '');
    data.teeth[key] = select.value;
  });

  data.schedule = {};
  form.querySelectorAll('.schedule-table select').forEach((select) => {
    data.schedule[select.name] = select.value;
  });
  console.log(data)
  return data;
}