import { BOX_TYPE } from './consts';
import { createEl, createGlyphEl, createSpinnerEl } from './elements';

function getClientWidth(el) {
  return el.getBoundingClientRect().width;
}

export default function createSpinner(initialBox, alphabet) {
  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  let timeout = null;

  // -- create
  const staticGlyphEl = createGlyphEl(initialBox.char, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = initialBox.type === BOX_TYPE.SPINNER
    ? createSpinnerEl(alphabet)
    : null;

  // -- methods
  function setValue(newBox, duration = 1000) {
    if (spinnerEl === null) return;

    clearTimeout(timeout);

    boxEl.style.width = `${getClientWidth(staticGlyphEl)}px`;
    boxEl.appendChild(spinnerEl);
    // eslint-disable-next-line no-unused-expressions
    spinnerEl.offsetWidth; // force reflow

    staticGlyphEl.style.visibility = 'hidden';
    spinnerEl.style.transition = `transform ${duration}ms ease-in-out`;
    spinnerEl.style.transform = `translate3d(0, ${-newBox.index * 100}%, 0)`;

    staticGlyphEl.innerText = newBox.char;
    boxEl.style.transition = `width ${duration}ms ease-in-out`;
    boxEl.style.width = `${getClientWidth(staticGlyphEl)}px`;

    timeout = setTimeout(() => {
      boxEl.style.transition = '';
      boxEl.style.width = '';

      spinnerEl.style.transition = '';
      staticGlyphEl.style.visibility = '';

      if (spinnerEl.parentElement === boxEl) boxEl.removeChild(spinnerEl);
    }, duration);
  }
  setValue(initialBox, 0);

  function getEl() {
    return boxEl;
  }

  function destroy() {
    clearTimeout(timeout);
  }

  return {
    getEl,
    setValue,
    destroy,
  };
}
