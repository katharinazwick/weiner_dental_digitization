import {
    orderTypes, genderOptions, insuranceOptions, shadeOptions, alloyOptions,
    toothFormOptions, typeOptions, toothStatusOptions, appointmentRows, timeOptions, toothNumbers, toothDefaultStatus,
    requestTypeOptions, exemptFieldsWhenReparatur,
} from './data.js';

const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function optionMarkup(options, selectedValue) {
    return options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const selected = value === selectedValue ? ' selected' : '';
        return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    }).join('');
}

function inputField({ id, label, value = '', required = false, type = 'text', placeholder = '' }) {
    return `
    <label class="field ${required ? 'required' : ''}" for="${id}">
      <span class="field-label">${escapeHtml(label)}</span>
      <input
        id="${id}"
        name="${id}"
        type="${type}"
        class="control"
        value="${escapeHtml(value)}"
        placeholder="${escapeHtml(placeholder)}"
        ${required ? 'data-required="true"' : ''}
      />
    </label>
  `;
}

function textareaField({ id, label, value = '', required = false, rows = 3, placeholder = '' }) {
    return `
    <label class="field ${required ? 'required' : ''}" for="${id}">
      <span class="field-label">${escapeHtml(label)}</span>
      <textarea
        id="${id}"
        name="${id}"
        class="control textarea"
        rows="${rows}"
        placeholder="${escapeHtml(placeholder)}"
        ${required ? 'data-required="true"' : ''}
      >${escapeHtml(value)}</textarea>
    </label>
  `;
}

function selectField({ id, label, options, selectedValue, required = false, compact = false }) {
    return `
    <label class="field ${required ? 'required' : ''} ${compact ? 'compact' : ''}" for="${id}">
      <span class="field-label">${escapeHtml(label)}</span>
      <select
        id="${id}"
        name="${id}"
        class="control"
        ${required ? 'data-required="true"' : ''}
      >
        ${optionMarkup(options, selectedValue)}
      </select>
    </label>
  `;
}

function checkboxField({ id, label, checked = false }) {
    return `
    <label class="field checkbox-field" for="${id}">
      <input
        id="${id}"
        name="${id}"
        type="checkbox"
        class="control control-checkbox"
        ${checked ? 'checked' : ''}
      />
      <span class="field-label">${escapeHtml(label)}</span>
    </label>
  `;
}

function appointmentRow(row, v = {}) {
    const dayValue = v[`${row.id}_day`] ?? '';
    return `
    <tr class="${row.required ? 'required-row' : ''}">
      <th scope="row">${escapeHtml(row.label)}${row.required ? ' <span class="required-star" aria-hidden="true">*</span>' : ''}</th>
      <td>
        <input 
        type="date" 
        class="control control-small" 
        name="${row.id}_day" 
        id="${row.id}_day"
        style="width: 100%;"
        value="${escapeHtml(dayValue)}"
        ${row.required ? 'data-required="true"' : ''}
/>
      </td>
      <td>
        <select class="control control-small" name="${row.id}_time" id="${row.id}_time" ${row.required ? 'data-required="true"' : ''}>
          ${optionMarkup(timeOptions, '')}
        </select>
      </td>
    </tr>
  `;
}

function toothCell(number, jaw) {
    const id = `tooth_${number}`;
    return `
    <div class="tooth-cell" data-tooth-cell>
      <span class="tooth-number">${number}</span>
      <select id="${id}" name="${id}" class="control control-tooth" data-required="true" aria-label="Zahn ${number}, ${jaw}">
        ${optionMarkup(toothStatusOptions, toothDefaultStatus)}
      </select>
    </div>
  `;
}

function toothRow(numbers, jaw, orientation = 'standard') {
    const cells = numbers.map((num) => toothCell(num, jaw)).join('');
    return `
    <div class="tooth-row ${orientation}">
      ${cells}
    </div>
  `;
}

function radioPills(name, options, checkedValue) {
    return `
    <div class="segmented" role="radiogroup" aria-label="${escapeHtml(name)}">
      ${options.map((opt) => {
        const checked = opt.value === checkedValue ? 'checked' : '';
        return `
          <label class="pill">
            <input type="radio" name="${name}" value="${escapeHtml(opt.value)}" ${checked} />
            <span>${escapeHtml(opt.label)}</span>
          </label>
        `;
    }).join('')}
    </div>
  `;
}

export function renderApp(v = {}) {
    const isReparatur = (v.requestType ?? 'neuantrag') === 'reparatur';
    const exempt = new Set(exemptFieldsWhenReparatur);
    const req = (fieldId) => !(isReparatur && exempt.has(fieldId));

    return `
    <div class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Zahntechnischer Meisterbetrieb</p>
          <h1>Weiner Dentaltechnik — digitale Auftragsmaske</h1>
        </div>
        <div class="hero-badge">
          <span>ISO 3950</span>
          <strong>FDI Zahnnotation</strong>
        </div>
      </header>

      <form id="labForm" class="lab-form" novalidate>
        <section class="panel">
          <div class="panel-head">
            <h2>Antragsart</h2>
          </div>
          <div class="stack">
            ${radioPills('requestType', requestTypeOptions, v.requestType ?? 'neuantrag')}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Auftrag & Patient</h2>
          </div>

          <div class="grid grid-2">
            <div class="stack">
              <span class="field-label">Versorgungsart</span>
              ${radioPills('orderType', orderTypes, v.orderType ?? '')}
            </div>

            ${selectField({
        id: 'insurance',
        label: 'Versicherung',
        options: insuranceOptions,
        selectedValue: v.insurance ?? '',
        required: true,
    })}

            ${inputField({
        id: 'patientFirstName',
        label: 'Vorname',
        value: v.patientFirstName ?? '',
    })}

    ${inputField({
        id: 'patientSecondName',
        label: 'Nachname',
        value: v.patientSecondName ?? '',
    })} 

${inputField({
        id: 'patientNumber',
        label: 'Patientennummer',
    })}

            ${inputField({
        id: 'patientAge',
        label: 'Alter',
        value: v.patientAge ?? '',
        required: req('patientAge'),
        type: 'number',
    })}

            ${selectField({
        id: 'patientGender',
        label: 'Geschlecht',
        options: genderOptions,
        selectedValue: v.patientGender ?? '',
        required: req('patientGender'),
    })}

            ${inputField({
        id: 'xmlNumber',
        label: 'XML-Nr.',
        value: v.xmlNumber ?? '',
    })}
          </div>

          <div class="grid grid-2 top-gap">
            ${inputField({
        id: 'dentistName',
        label: 'Name des Zahnarztes',
        value: v.dentistName ?? '',
        required: true,
    })}
            ${inputField({
        id: 'practiceName',
        label: 'Praxis - Anschrift',
        value: v.practiceName ? v.practiceName + (v.dentistAddress ? ', ' + v.dentistAddress : '') : '',
        required: true,
    })} ${inputField({
        id: 'practiceEmail',
        label: 'Praxis - Email',
        value: v.practiceEmail ?? '',
        required: true,
    })}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Ästhetik & Material</h2>
          </div>

          <div class="grid grid-3">
            ${selectField({
        id: 'shade',
        label: 'Zahnfarbe',
        options: shadeOptions,
        selectedValue: v.shade ?? '',
        required: req('shade'),
    })}

            ${selectField({
        id: 'alloy',
        label: 'Material',
        options: alloyOptions,
        selectedValue: v.alloy ?? '',
        required: req('alloy'),
    })}

            ${selectField({
        id: 'toothForm',
        label: 'Zahnform',
        options: toothFormOptions,
        selectedValue: v.toothForm ?? '',
    })}
          </div>

          <div class="grid grid-3 top-gap">
            ${selectField({
        id: 'type',
        label: 'Typ',
        options: typeOptions,
        selectedValue: v.type ?? '',
        required: true,
    })}
          </div>

          <div class="grid grid-3 top-gap">
            ${checkboxField({
        id: 'gesichtsbogen',
        label: 'Gesichtsbogen vorhanden',
        checked: v.gesichtsbogen === true || v.gesichtsbogen === 'on',
    })}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Zahnstatus</h2>
          </div>

          <div class="tooth-legend">
            ${toothStatusOptions.map((opt) => `<span><i></i>${escapeHtml(opt.label)}</span>`).join('')}
          </div>

          <div class="tooth-chart">
            <div class="jaw-label upper">Oberkiefer</div>
            ${toothRow(toothNumbers.upperRight, 'Oberkiefer', 'reverse')}
            ${toothRow(toothNumbers.upperLeft, 'Oberkiefer', 'standard')}
            <div class="jaw-label lower">Unterkiefer</div>
            ${toothRow(toothNumbers.lowerRight, 'Unterkiefer', 'reverse')}
            ${toothRow(toothNumbers.lowerLeft, 'Unterkiefer', 'standard')}
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Leistung & Termine</h2>
          </div>

          <div class="grid grid-2">
            ${textareaField({
        id: 'contractService',
        label: 'Vertrags-Leistung',
        value: v.contractService ?? '',
        rows: 4,
        placeholder: 'Leistung beschreiben',
    })}
            ${textareaField({
        id: 'privateService',
        label: 'Privat-Leistung',
        value: v.privateService ?? '',
        rows: 4,
        placeholder: 'Zusatzleistungen beschreiben',
    })}
          </div>

          <div class="schedule-card">
            <div class="schedule-head">
              <span>Termin</span>
              <span>Datum</span>
              <span>Uhr</span>
            </div>
            <table class="schedule-table">
              <tbody>
${appointmentRows.map(row => appointmentRow(row, v)).join('')}              </tbody>
            </table>
          </div>

          <div class="grid grid-2 top-gap">
            ${textareaField({
        id: 'phoneNote',
        label: 'Bitte telefonische Rücksprache',
        value: v.phoneNote ?? '',
        rows: 2,
        placeholder: 'Optional',
    })}
            ${textareaField({
        id: 'deliveredWith',
        label: 'Mitgeliefert',
        value: v.deliveredWith ?? '',
        rows: 2,
        placeholder: 'Optional',
    })}
          </div>

          <div class="top-gap">
            ${textareaField({
        id: 'completionNote',
        label: 'Fertigstellung',
        value: v.completionNote ?? '',
        rows: 2,
        placeholder: 'Optional',
    })}
          </div>
        </section>

        <div class="actions">
          <button id="transformBtn" type="submit" class="transform-btn">Absenden</button>
        </div>
      </form>

      <div id="modalBackdrop" class="modal-backdrop" hidden>
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <h3 id="modalTitle">Hinweis</h3>
          <p id="modalMessage"></p>
          <div class="modal-actions">
            <button type="button" id="modalClose" class="modal-btn">Schließen</button>
          </div>
        </div>
      </div>
    </div>
  `;
}