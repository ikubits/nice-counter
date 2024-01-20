import { createEl, createGlyphEl, createSpinnerEl } from './elements';

const ALPHABET = '0123456789'.split('');

export default function createSpinner(_value, _isActive) {
  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const value = _value;
  const index = ALPHABET.indexOf(value);
  const isDigit = index !== -1;
  const isStatic = !isDigit;

  const staticGlyphEl = createGlyphEl(value, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = isStatic ? null : createSpinnerEl(ALPHABET);
  if (!isStatic) {
    boxEl.appendChild(spinnerEl);
    staticGlyphEl.style.visibility = 'hidden';
  }

  function setActive(isActive) {
    if (spinnerEl === null) return;

    const targetIndex = isActive ? index : 0;
    spinnerEl.style.transform = `translate3d(0, ${-targetIndex * 100}%, 0)`;
  }
  setActive(_isActive);

  function getEl() {
    return boxEl;
  }

  function destroy() {

  }

  return {
    getEl,
    setActive,
    destroy,
  };
}
