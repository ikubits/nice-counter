import { easeInOutCubic } from './easing';
import { BOX_TYPE } from './consts';
import { createEl } from './elements';
import createSpinner from './spinner';
import createEffect from './effect';

const ALPHABET = '0123456789'.split('');
const DURATION = 1000;

function parseValue(value, alphabet) {
  const valueChars = value.split('');
  const size = valueChars.length;

  let spinnerIndex = 0;

  const boxes = [];
  for (let i = 0; i < size; i++) {
    const char = valueChars[i];
    const boxState = {};

    const index = alphabet.indexOf(char);
    const isSpinner = index !== -1;
    boxState.type = isSpinner;
    boxState.index = index;

    boxes[i] = {
      type: isSpinner ? BOX_TYPE.SPINNER : BOX_TYPE.STATIC,
      char,
      index: isSpinner ? index : 0,
      spinnerIndex,
    };

    if (isSpinner) spinnerIndex += 1;
  }

  return boxes;
}

function cloneBoxes(boxes, changeFn = (box) => box) {
  const newBoxes = [];
  const size = boxes.length;
  for (let i = 0; i < size; i++) {
    newBoxes[i] = changeFn({ ...boxes[i] }, i);
  }
  return newBoxes;
}

function validateBoxes(patternBoxes, valueBoxes) {
  const patternSize = patternBoxes.length;
  const valueSize = valueBoxes.length;

  if (valueSize !== patternSize) {
    console.warn('Mismatch length');
    return false;
  }

  for (let i = 0; i < patternSize; i++) {
    if (valueBoxes[i].type !== patternBoxes[i].type) {
      console.warn('Mismatch pattern');
      return false;
    }
  }

  return true;
}

export default function createCounter(patterValue, initialValue = '', defaultValue = '', options = {}) {
  const patternBoxes = parseValue(patterValue, ALPHABET);
  const size = patternBoxes.length;
  let duration = options.duration ?? DURATION;

  const ease = easeInOutCubic;

  const emptyBoxes = cloneBoxes(patternBoxes, (box) => ({
    ...box,
    char: box.type === BOX_TYPE.SPINNER
      ? ALPHABET[0]
      : box.char,
    index: 0,
  }));

  const initialBoxes = initialValue !== ''
    ? parseValue(initialValue, ALPHABET)
    : cloneBoxes(emptyBoxes);

  const defaultBoxes = defaultValue !== ''
    ? parseValue(defaultValue, ALPHABET)
    : cloneBoxes(patternBoxes);

  // -- create root
  const rootEl = createEl('span', {
    class: 'nc',
  });

  // -- create spinners
  const fragment = document.createDocumentFragment();
  const spinners = [];
  for (let i = 0; i < size; i++) {
    const spinner = createSpinner(initialBoxes[i], ALPHABET);
    spinners.push(spinner);
    fragment.appendChild(spinner.getEl());
  }
  rootEl.appendChild(fragment);

  // -- create effect
  const effect = createEffect();
  rootEl.appendChild(effect.getEl());

  // -- animation
  function startTween(valueBoxes) {
    for (let i = 0; i < size; i++) {
      spinners[i].startTween(valueBoxes[i]);
    }
  }

  function updateTween(progress) {
    for (let i = 0; i < size; i++) {
      spinners[i].updateTween(progress);
    }
  }

  function endTween() {
    for (let i = 0; i < size; i++) {
      spinners[i].endTween();
    }
  }

  // -- animation loop
  let raf = null;
  let startTime = 0;
  let endTime = 0;

  function tick(timestamp) {
    if (timestamp >= endTime) {
      updateTween(1);
      endTween();
      return;
    }

    updateTween(ease((timestamp - startTime) / duration));

    raf = requestAnimationFrame(tick);
  }

  function firstTick(timestamp) {
    startTime = timestamp;
    endTime = startTime + duration;

    tick(timestamp);
  }

  function startLoop() {
    raf = requestAnimationFrame(firstTick);
  }

  function stopLoop() {
    cancelAnimationFrame(raf);
  }

  // -- methods
  /**
   * Animates to new value
   * @param {object} newBox counter box object
   * @param {number} duration animation duration
   */
  function setValue(value) {
    let valueBoxes;
    if (value === null) valueBoxes = defaultBoxes;
    else if (value === '') valueBoxes = emptyBoxes;
    else valueBoxes = parseValue(value, ALPHABET);

    if (!validateBoxes(patternBoxes, valueBoxes)) return;

    startTween(valueBoxes);
    startLoop();
  }

  /**
   * Sets new animation duration
   * @param {number} newDuration animation duration
   */
  function setDuration(newDuration) {
    duration = parseInt(newDuration === '' ? 0 : (newDuration ?? DURATION), 10);
  }

  /**
   * Returns counter root element
   * @returns {element} counter root element
   */
  function getRootEl() {
    return rootEl;
  }

  /**
   * Destroy clean up
   */
  function destroy() {
    stopLoop();

    for (let i = 0; i < size; i++) {
      spinners[i].destroy();
    }
  }

  return {
    getRootEl,
    setValue,
    setDuration,
    destroy,
  };
}
