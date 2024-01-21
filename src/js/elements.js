import { SVG_NS } from './consts';

/**
 * Create new svg element with optional attributes
 * @param {string} tagName tag name
 * @param {object} attrs { attrName: attrValue }
 * @returns {element} created element
 */
export function createSvgEl(tagName, attrs = {}) {
  // element
  const el = document.createElementNS(SVG_NS, tagName);

  // attributes
  Object.keys(attrs).forEach((key) => {
    // el.setAttributeNS(SVG_NS, key, attrs[key]);
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

/**
 * Create new element with optional attributes
 * @param {string} tagName tag name
 * @param {object} attrs { attrName: attrValue }
 * @returns {element} created element
 */
export function createEl(tagName, attrs = {}) {
  // element
  const el = document.createElement(tagName);

  // attributes
  Object.keys(attrs).forEach((key) => {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

/**
 * Create new glyph element
 * @param {string} value element innerText
 * @param {boolean} isStatic determine element classes
 * @returns {element} created element
 */
export function createGlyphEl(value, isStatic = false) {
  const glyphEl = createEl('span', {
    class: `nc__glyph${isStatic ? ' nc__glyph--static' : ''}`,
  });

  glyphEl.innerText = value;

  return glyphEl;
}

/**
 * Create new spinner element
 * @param {string[]} alphabet array of chars
 * @returns {element} created element
 */
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
