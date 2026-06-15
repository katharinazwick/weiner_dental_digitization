import {
    orderTypes, genderOptions, insuranceOptions, shadeOptions, alloyOptions,
    toothFormOptions, typeOptions, toothStatusOptions, appointmentRows,
    dayOptions, timeOptions, toothNumbers, defaultValues, toothDefaultStatus,
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

function appointmentRow(row) {
    return `
    <tr>
      <th scope="row">${escapeHtml(row.label)}</th>
      <td>
        <select class="control control-small" name="${row.id}_day" id="${row.id}_day" ${row.required ? 'data-required="true"' : ''}>
          ${optionMarkup(dayOptions, 'mo')}
        </select>
      </td>
      <td>
        <select class="control control-small" name="${row.id}_time" id="${row.id}_time" ${row.required ? 'data-required="true"' : ''}>
          ${optionMarkup(timeOptions, '10:00')}
        </select>
      </td>
    </tr>
  `;
}

function toothCell(number, jaw, index) {
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
    const cells = numbers.map((num, index) => toothCell(num, jaw, index)).join('');
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

export function renderApp() {
    return `
    <div class="page-shell">
      <header class="hero">
        <div>
          <p class="eyebrow">Zahntechnischer Meisterbetrieb</p>
          <h1>Weiner Dentaltechnik — digitale Auftragsmaske</h1>
          <p class="hero-copy">
            ...
          </p>
        </div>
        <div class="hero-badge">
          <span>ISO 3950</span>
          <strong>FDI Zahnnotation</strong>
        </div>
      </header>

      <form id="labForm" class="lab-form" novalidate>
        <section class="panel">
          <div class="panel-head">
            <h2>Auftrag & Patient</h2>
          </div>

          <div class="grid grid-2">
            <div class="stack">
              <span class="field-label">Versorgungsart</span>
              ${radioPills('orderType', orderTypes, defaultValues.orderType)}
            </div>

            ${selectField({
        id: 'insurance',
        label: 'Versicherung',
        options: insuranceOptions,
        selectedValue: defaultValues.insurance,
        required: true,
    })}

            ${inputField({
        id: 'patientName',
        label: 'Patient',
        value: defaultValues.patientName,
        required: true,
    })}

            ${inputField({
        id: 'patientAge',
        label: 'Alter',
        value: defaultValues.patientAge,
        required: true,
        type: 'number',
    })}

            ${selectField({
        id: 'patientGender',
        label: 'Geschlecht',
        options: genderOptions,
        selectedValue: defaultValues.patientGender,
        required: true,
    })}

            ${inputField({
        id: 'xmlNumber',
        label: 'XML-Nr.',
        value: defaultValues.xmlNumber,
        required: true,
    })}
          </div>

          <div class="grid grid-2 top-gap">
            ${inputField({
        id: 'dentistName',
        label: 'Name des Zahnarztes',
        value: defaultValues.dentistName,
        required: true,
    })}
            ${inputField({
        id: 'practiceName',
        label: 'Praxis / Anschrift',
        value: defaultValues.practiceName + ', ' + defaultValues.dentistAddress,
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
        selectedValue: defaultValues.shade,
        required: true,
    })}

            ${selectField({
        id: 'alloy',
        label: 'Legierung',
        options: alloyOptions,
        selectedValue: defaultValues.alloy,
        required: true,
    })}

            ${selectField({
        id: 'toothForm',
        label: 'Zahnform',
        options: toothFormOptions,
        selectedValue: defaultValues.toothForm,
        required: true,
    })}

            ${selectField({
        id: 'type',
        label: 'Typ',
        options: typeOptions,
        selectedValue: defaultValues.type,
        required: true,
    })}
          </div>
          
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Zahnstatus</h2>
            <p>Digitale Zahnkarte im FDI-Schema</p>
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
        value: defaultValues.contractService,
        rows: 4,
        placeholder: 'Leistung beschreiben',
    })}
            ${textareaField({
        id: 'privateService',
        label: 'Privat-Leistung',
        value: defaultValues.privateService,
        rows: 4,
        placeholder: 'Zusatzleistungen beschreiben',
    })}
          </div>

          <div class="schedule-card">
            <div class="schedule-head">
              <span>Termin</span>
              <span>Tag</span>
              <span>Uhr</span>
            </div>
            <table class="schedule-table">
              <tbody>
                ${appointmentRows.map(appointmentRow).join('')}
              </tbody>
            </table>
          </div>

          <div class="grid grid-2 top-gap">
            ${textareaField({
        id: 'phoneNote',
        label: 'Bitte telefonische Rücksprache',
        value: defaultValues.phoneNote,
        rows: 2,
        placeholder: 'Optional',
    })}
            ${textareaField({
        id: 'deliveredWith',
        label: 'Mitgeliefert',
        value: defaultValues.deliveredWith,
        rows: 2,
        placeholder: 'Optional',
    })}
          </div>

          <div class="top-gap">
            ${textareaField({
        id: 'completionNote',
        label: 'Fertigstellung',
        value: defaultValues.completionNote,
        rows: 2,
        placeholder: 'Optional',
    })}
          </div>
        </section>

        <div class="actions">
          <button id="transformBtn" type="submit" class="transform-btn">Transformieren</button>
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