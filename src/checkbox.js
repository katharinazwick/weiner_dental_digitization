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