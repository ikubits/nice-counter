export function createEl(tagName, attrs = {}) {
  // element
  const el = document.createElement(tagName);

  // attributes
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

export function createGlyphEl(value, isStatic = false) {
  const glyphEl = createEl('span', {
    class: `nc__glyph${isStatic ? ' nc__glyph--static' : ''}`,
  });

  glyphEl.innerText = value;

  return glyphEl;
}

export function createSpinnerEl(alphabet) {
  const spinnerEl = createEl('span', {
    class: 'nc__spinner',
  });

  // create alphabet glyphs
  const size = alphabet.length;
  for (let i = 0; i < size; i++) {
    const glyphEl = createGlyphEl(alphabet[i]);
    spinnerEl.appendChild(glyphEl);
  }

  // create first glyph again for loop
  const glyphEl = createGlyphEl(alphabet[0]);
  spinnerEl.appendChild(glyphEl);

  return spinnerEl;
}

export default {
  createEl,
  createGlyphEl,
  createSpinnerEl,
};
