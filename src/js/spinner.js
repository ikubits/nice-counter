import { lerp } from './helpers';
import { BOX_TYPE } from './consts';
import { createEl, createGlyphEl, createSpinnerEl } from './elements';

function getClientWidth(el) {
  return el.getBoundingClientRect().width;
}

export default function createSpinner(initialBox, alphabet) {
  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const size = alphabet.length;
  // let timeout = null;

  // -- create
  const staticGlyphEl = createGlyphEl(initialBox.char, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = initialBox.type === BOX_TYPE.SPINNER
    ? createSpinnerEl(alphabet)
    : null;

  // -- methods
  // /**
  //  * Animates to new value
  //  * @param {object} newBox counter box object
  //  * @param {number} duration animation duration
  //  */
  // function setValue(newBox, duration = 1000) {
  //   if (spinnerEl === null) return;

  //   clearTimeout(timeout);

  //   boxEl.style.width = `${getClientWidth(staticGlyphEl)}px`;
  //   boxEl.appendChild(spinnerEl);
  //   // eslint-disable-next-line no-unused-expressions
  //   spinnerEl.offsetWidth; // force reflow

  //   staticGlyphEl.style.visibility = 'hidden';
  //   spinnerEl.style.transition = `transform ${duration}ms ease-in-out`;
  //   spinnerEl.style.transform = `translate3d(0, ${-newBox.index * 100}%, 0)`;

  //   staticGlyphEl.innerText = newBox.char;
  //   boxEl.style.transition = `width ${duration}ms ease-in-out`;
  //   boxEl.style.width = `${getClientWidth(staticGlyphEl)}px`;

  //   timeout = setTimeout(() => {
  //     boxEl.style.transition = '';
  //     boxEl.style.width = '';

  //     spinnerEl.style.transition = '';
  //     staticGlyphEl.style.visibility = '';

  //     if (spinnerEl.parentElement === boxEl) boxEl.removeChild(spinnerEl);
  //   }, duration);
  // }
  // setValue(initialBox, 0);

  let lastWidth = 0;
  let lastIndex = 0;
  let targetWidth = 0;
  let targetIndex = 0;

  function getModIndex(index) {
    return ((index % size) + size) % size;
  }

  function startTween(newBox) {
    if (spinnerEl === null) return;

    lastWidth = getClientWidth(staticGlyphEl);
    boxEl.style.width = `${lastWidth}px`;
    boxEl.appendChild(spinnerEl);
    // eslint-disable-next-line no-unused-expressions
    spinnerEl.offsetWidth; // force reflow

    staticGlyphEl.style.visibility = 'hidden';
    staticGlyphEl.innerText = newBox.char;

    const sign = newBox.index >= lastIndex ? 1 : -1;
    targetIndex = newBox.index + (newBox.spinnerIndex * size * sign);
    targetWidth = getClientWidth(staticGlyphEl);
  }

  function updateTween(progress) {
    if (spinnerEl === null) return;

    const currentIndex = lerp(lastIndex, targetIndex, progress);
    const currentWidth = lerp(lastWidth, targetWidth, progress);

    spinnerEl.style.transform = `translate3d(0, ${-getModIndex(currentIndex) * 100}%, 0)`;
    boxEl.style.width = `${currentWidth}px`;
  }

  function endTween() {
    if (spinnerEl === null) return;

    lastWidth = targetWidth;
    lastIndex = getModIndex(targetIndex);

    boxEl.style.width = '';
    staticGlyphEl.style.visibility = '';

    if (spinnerEl.parentElement === boxEl) boxEl.removeChild(spinnerEl);
  }

  // set initial
  startTween(initialBox);
  updateTween(1);
  endTween();

  /**
   * Returns counter box element
   * @returns {element} counter box element
   */
  function getEl() {
    return boxEl;
  }

  /**
   * Destroy clean up
   */
  function destroy() {
    // clearTimeout(timeout);
  }

  return {
    getEl,
    // setValue,
    startTween,
    updateTween,
    endTween,
    destroy,
  };
}
