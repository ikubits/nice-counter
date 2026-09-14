import { lerp } from './helpers';
import { BOX_TYPE } from './consts';
import { createEl, createGlyphEl, createSpinnerEl } from './elements';

function getAccurateWidth(el) {
  return el.getBoundingClientRect().width;
}

export default function createSpinner(signature, alphabet) {
  let alive = true;
  const { type, key } = signature;
  const isSpinner = type === BOX_TYPE.SPINNER;

  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const size = alphabet.length;

  // -- create
  const staticGlyphEl = createGlyphEl(signature.char, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = isSpinner
    ? createSpinnerEl(alphabet)
    : createSpinnerEl([signature.char]);

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

    const nextChar = nextSignature.char;
    if (!isSpinner && nextChar === prevChar) return;

    // for static
    const [bIndex, eIndex] = direction === -1 ? [1, 0] : [0, 1];

    beginWidth = getAccurateWidth(staticGlyphEl);
    beginIndex = isSpinner
      ? prevIndex
      : bIndex;

    if (!isSpinner) {
      spinnerEl.children[bIndex].innerText = prevChar;
      spinnerEl.children[eIndex].innerText = nextChar;
      spinnerEl.style.transform = `translate3d(0, ${bIndex * -100}%, 0)`;
    }

    boxEl.style.width = `${beginWidth}px`;
    boxEl.appendChild(spinnerEl);

    staticGlyphEl.style.visibility = 'hidden';
    staticGlyphEl.innerText = nextChar;

    targetIndex = isSpinner
      ? nextSignature.index + (nextSignature.spinnerIndex * size * direction)
      : eIndex;
    targetWidth = getAccurateWidth(staticGlyphEl);

    prevChar = nextChar;
    prevIndex = getModIndex(targetIndex);

    animating = true;
  }

  function updateTween(progress) {
    if (!animating) return;

    const currentIndex = lerp(beginIndex, targetIndex, progress);
    const currentWidth = lerp(beginWidth, targetWidth, progress);

    spinnerEl.style.transform = `translate3d(0, ${getModIndex(currentIndex) * -100}%, 0)`;
    boxEl.style.width = `${currentWidth}px`;
  }

  function endTween() {
    if (!animating) return;

    boxEl.style.width = '';
    staticGlyphEl.style.visibility = '';

    if (spinnerEl.parentElement === boxEl) boxEl.removeChild(spinnerEl);
    spinnerEl.style.transform = '';

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
   * Returns spinner key
   * @returns {string} spinner key
   */
  function getKey() {
    return key;
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
    getKey,
    startTween,
    updateTween,
    endTween,
    destroy,
    isAlive,
  };
}
