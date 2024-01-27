import { lerp } from './helpers';
import { BOX_TYPE, GLYPH_TYPE } from './consts';
import { createEl, createGlyphEl, createSpinnerEl } from './elements';

function getAccurateWidth(el) {
  return el.getBoundingClientRect().width;
}

export default function createSpinner(signature, alphabet) {
  let alive = true;
  const { type } = signature;
  const isSpinner = type === BOX_TYPE.SPINNER;

  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const size = alphabet.length;

  // -- create
  const staticGlyphEl = createGlyphEl(signature.char, GLYPH_TYPE.STATIC);
  boxEl.appendChild(staticGlyphEl);

  const animatedEl = isSpinner
    ? createSpinnerEl(alphabet)
    : createGlyphEl(signature.char, GLYPH_TYPE.ANIMATED);

  // -- methods
  let prevChar = signature.char;
  let prevIndex = signature.index;
  let animating = false;
  let beginWidth = 0;
  let beginIndex = 0;
  let targetWidth = 0;
  let targetIndex = 0;

  function getModIndex(index) {
    return ((index % size) + size) % size;
  }

  function startTween(nextSignature, direction) {
    if (animating) return;
    if (!isSpinner && nextSignature.char === prevChar) return;

    beginWidth = getAccurateWidth(staticGlyphEl);
    beginIndex = prevIndex;
    if (!isSpinner) animatedEl.innerText = prevChar;
    boxEl.style.width = `${beginWidth}px`;
    boxEl.appendChild(animatedEl);

    staticGlyphEl.style.visibility = 'hidden';
    staticGlyphEl.innerText = nextSignature.char;

    targetIndex = isSpinner
      ? nextSignature.index + (nextSignature.spinnerIndex * size * direction)
      : direction;
    targetWidth = getAccurateWidth(staticGlyphEl);

    prevChar = nextSignature.char;
    prevIndex = isSpinner
      ? getModIndex(targetIndex)
      : 0;

    animating = true;
  }

  function updateTween(progress) {
    if (!animating) return;

    const currentIndex = lerp(beginIndex, targetIndex, progress);
    const currentWidth = lerp(beginWidth, targetWidth, progress);

    const translateY = (
      isSpinner
        ? getModIndex(currentIndex)
        : currentIndex
    ) * -100;

    animatedEl.style.transform = `translate3d(0, ${translateY}%, 0)`;
    boxEl.style.width = `${currentWidth}px`;
  }

  function endTween() {
    if (!animating) return;

    boxEl.style.width = '';
    staticGlyphEl.style.visibility = '';

    if (animatedEl.parentElement === boxEl) boxEl.removeChild(animatedEl);
    animatedEl.style.transform = '';

    animating = false;
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
