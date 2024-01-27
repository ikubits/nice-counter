import { lerp } from './helpers';
import { BOX_TYPE } from './consts';
import { createEl, createGlyphEl, createSpinnerEl } from './elements';

function getClientWidth(el) {
  return el.getBoundingClientRect().width;
}

export default function createSpinner(signature, alphabet) {
  let alive = true;
  const { type } = signature;

  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const size = alphabet.length;

  // -- create
  const staticGlyphEl = createGlyphEl(signature.char, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = type === BOX_TYPE.SPINNER
    ? createSpinnerEl(alphabet)
    : null;

  // -- methods

  let lastWidth = 0;
  let lastIndex = 0;
  let targetWidth = 0;
  let targetIndex = 0;

  function getModIndex(index) {
    return ((index % size) + size) % size;
  }

  function startTween(nextSignature, direction) {
    if (spinnerEl === null) return;

    lastWidth = getClientWidth(staticGlyphEl);
    boxEl.style.width = `${lastWidth}px`;
    boxEl.appendChild(spinnerEl);

    staticGlyphEl.style.visibility = 'hidden';
    staticGlyphEl.innerText = nextSignature.char;

    targetIndex = nextSignature.index + (nextSignature.spinnerIndex * size * direction);
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
  startTween(signature, 1);
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
    alive = false;
  }

  /**
   * Chack is spinner alive
   */
  function isAlive() {
    return alive;
  }

  return {
    getEl,
    startTween,
    updateTween,
    endTween,
    destroy,
    isAlive,
  };
}
