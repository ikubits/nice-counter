import { createEl, createGlyphEl, createSpinnerEl } from './elements';

export default function createSpinner(_value, _isActive, alphabet) {
  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const value = _value;
  const index = alphabet.indexOf(value);
  const isDigit = index !== -1;
  const isStatic = !isDigit;

  let timeout = null;

  const staticGlyphEl = createGlyphEl(value, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = isStatic ? null : createSpinnerEl(alphabet);
  if (!isStatic) {
    boxEl.appendChild(spinnerEl);
    staticGlyphEl.style.visibility = 'hidden';
  }

  function setActive(isActive, duration = 1000) {
    if (spinnerEl === null) return;

    const targetIndex = isActive ? index : 0;

    clearTimeout(timeout);

    staticGlyphEl.style.visibility = 'hidden';

    spinnerEl.style.visibility = 'visible';
    spinnerEl.style.transition = `transform ${duration / 1000}s ease-in-out`;
    spinnerEl.style.transform = `translate3d(0, ${-targetIndex * 100}%, 0)`;

    staticGlyphEl.innerText = alphabet[targetIndex];

    timeout = setTimeout(() => {
      spinnerEl.style.transition = '';
      spinnerEl.style.visibility = '';

      staticGlyphEl.style.visibility = '';
    }, duration);
  }
  setActive(_isActive);

  function getEl() {
    return boxEl;
  }

  function destroy() {
    clearTimeout(timeout);
  }

  return {
    getEl,
    setActive,
    destroy,
  };
}
