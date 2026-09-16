import { easeInOutCubic } from './easing';
import { BOX_TYPE } from './consts';
import { createEl } from './elements';
import createSpinner from './spinner';
import createEffect from './effect';

const ALPHABET = '0123456789'.split('');
const DURATION = 1000;

function getSignature(value, alphabet, empty) {
  const valueChars = value.split('');
  const size = valueChars.length;

  let spinnerIndex = 0;

  const boxes = [];
  for (let i = 0; i < size; i++) {
    const char = valueChars[i];

    const index = alphabet.indexOf(char);
    const isSpinner = index !== -1;

    boxes[i] = {
      type: isSpinner ? BOX_TYPE.SPINNER : BOX_TYPE.STATIC,
      char: (isSpinner && empty) ? alphabet[0] : char,
      index: (isSpinner && !empty) ? index : 0,
      spinnerIndex,
    };

    if (isSpinner) spinnerIndex += 1;
  }

  let spinnerKey = 0;
  let staticKey = 0;

  for (let i = size - 1; i >= 0; i--) {
    if (boxes[i].type === BOX_TYPE.SPINNER) boxes[i].key = spinnerKey++;
    else if (boxes[i].type === BOX_TYPE.STATIC) boxes[i].key = staticKey++;
  }

  return boxes;
}

function getDirection(prevSignature, nextSignature) {
  const prevLength = prevSignature.length;
  const nextLength = nextSignature.length;

  const l = Math.min(prevLength, nextLength);
  for (let i = 0; i < l; i++) {
    if (nextSignature[i].index > prevSignature[i].index) return 1;
    if (nextSignature[i].index < prevSignature[i].index) return -1;
  }

  if (nextLength > prevLength) return 1;
  if (nextLength < prevLength) return -1;

  return 0;
}

export default function createCounter(initialValue = '', defaultValue = '', options = {}) {
  const defaultSignature = getSignature(defaultValue, ALPHABET);
  const emptySignature = getSignature(defaultValue, ALPHABET, true);
  let prevSignature;
  if (initialValue === null || initialValue === undefined) {
    prevSignature = defaultSignature;
  } else if (initialValue === '') {
    prevSignature = emptySignature;
  } else {
    prevSignature = getSignature(initialValue, ALPHABET);
  }
  let spinners = [];

  let duration = options.duration ?? DURATION;

  const ease = easeInOutCubic;

  // -- create root
  const rootEl = createEl('span', {
    class: 'nc',
  });

  // -- create spinners
  const fragment = document.createDocumentFragment();
  {
    const size = prevSignature.length;
    for (let i = 0; i < size; i++) {
      const spinner = createSpinner(prevSignature[i], ALPHABET);
      spinners.push(spinner);
      fragment.appendChild(spinner.getEl());
    }
  }
  rootEl.appendChild(fragment);

  // -- create effect
  const effect = createEffect();
  rootEl.appendChild(effect.getEl());

  function eachSpinner(callback) {
    const size = spinners.length;
    for (let i = 0; i < size; i++) {
      callback(spinners[i], i);
    }
  }

  // -- animation
  function startTween(nextSignature, direction) {
    // spinners = spinners.filter((spinner) => spinner.isAlive());

    eachSpinner((spinner, index) => {
      spinner.startTween(nextSignature[index], direction);
    });
  }

  function updateTween(progress) {
    eachSpinner((spinner) => {
      spinner.updateTween(progress);
    });

    const blur = 10 * Math.sin(progress * Math.PI);
    effect.setValue(blur);
  }

  function endTween() {
    eachSpinner((spinner) => {
      spinner.endTween();
    });

    spinners = spinners.filter((spinner) => !spinner.isDestroyed);
  }

  // -- animation loop
  let raf = null;
  let startTime = 0;
  let endTime = 0;
  let lastTimestamp = 0;

  function tick(timestamp) {
    lastTimestamp = timestamp;
    if (timestamp >= endTime) {
      updateTween(1);
      endTween();
      raf = null;
      return;
    }

    updateTween(ease((timestamp - startTime) / duration));

    raf = requestAnimationFrame(tick);
  }

  function firstTick(timestamp) {
    lastTimestamp = timestamp;
    startTime = timestamp;
    endTime = startTime + duration;

    tick(timestamp);
  }

  function startLoop() {
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    raf = requestAnimationFrame(firstTick);
  }

  function stopLoop() {
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  // -- methods
  /**
   * Animates to new value
   * @param {object} newBox counter box object
   * @param {number} duration animation duration
   */
  function setValue(value) {
    let nextSignature;
    if (value === null) nextSignature = defaultSignature;
    else if (value === '') nextSignature = emptySignature;
    else nextSignature = getSignature(value, ALPHABET);

    const direction = getDirection(prevSignature, nextSignature);

    startTween(nextSignature, direction);
    startLoop();

    prevSignature = nextSignature;
  }

  /**
   * Sets new animation duration
   * @param {number} newDuration animation duration
   */
  function setDuration(newDuration) {
    const parsedDuration = parseInt(newDuration === '' ? 0 : (newDuration ?? DURATION), 10);
    if (raf !== null && lastTimestamp > 0 && duration > 0) {
      const elapsed = lastTimestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      duration = parsedDuration;
      startTime = lastTimestamp - (progress * duration);
      endTime = startTime + duration;
    } else {
      duration = parsedDuration;
    }
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

    eachSpinner((spinner) => {
      spinner.destroy();
    });
  }

  return {
    getRootEl,
    setValue,
    setDuration,
    destroy,
  };
}
