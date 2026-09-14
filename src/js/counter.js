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

  const boxes = [];
  for (let i = 0; i < size; i++) {
    const char = valueChars[i];

    const index = alphabet.indexOf(char);
    const isSpinner = index !== -1;

    boxes[i] = {
      type: isSpinner ? BOX_TYPE.SPINNER : BOX_TYPE.STATIC,
      char: (isSpinner && empty) ? alphabet[0] : char,
      index: (isSpinner && !empty) ? index : 0,
    };
  }

  let spinnerKey = 0;
  let staticKey = 0;

  for (let i = size - 1; i >= 0; i--) {
    if (boxes[i].type === BOX_TYPE.SPINNER) boxes[i].key = `sp${spinnerKey++}`;
    else if (boxes[i].type === BOX_TYPE.STATIC) boxes[i].key = `st${staticKey++}`;
  }

  return boxes;
}

function getDiff(prevSignature, nextSignature) {
  const diffSignature = [];

  const nl = nextSignature.length;
  let pl = prevSignature.length;

  let direction = 1;
  let match = false;
  const prevStack = [];
  for (let ni = nl - 1; ni >= 0; ni--) {
    const nextChar = { ...nextSignature[ni] };
    match = false;

    for (let pi = pl - 1; pi >= 0; pi--) {
      const prevChar = { ...prevSignature[pi] };

      if (prevChar.type === nextChar.type && prevChar.key === nextChar.key) {
        diffSignature.unshift(...prevStack);
        prevStack.splice(0, prevStack.length);
        pl = pi;

        match = true;
        if (nextChar.index > prevChar.index) direction = 1;
        else if (nextChar.index < prevChar.index) direction = -1;

        break;
      }

      prevChar.leave = true;
      prevStack.unshift(prevChar);
    }

    if (match === false) nextChar.enter = true;
    // direction check
    diffSignature.unshift(nextChar);
  }

  if (prevStack.length > 0) {
    diffSignature.unshift(...prevStack);
    direction = -1;
  }

  // spinner index
  let spinnerIndex = 0;
  const size = diffSignature.length;
  for (let i = 0; i < size; i++) {
    diffSignature[i].spinnerIndex = spinnerIndex;
    if (diffSignature[i].type === BOX_TYPE.SPINNER) spinnerIndex++;
  }

  return [diffSignature, direction];
}

export default function createCounter(initialValue = '', defaultValue = '', options = {}) {
  const defaultSignature = getSignature(defaultValue, ALPHABET);
  const emptySignature = getSignature(defaultValue, ALPHABET, true);
  let prevSignature = getSignature(initialValue, ALPHABET);
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
    let nextSignature;
    if (value === null) nextSignature = defaultSignature;
    else if (value === '') nextSignature = emptySignature;
    else nextSignature = getSignature(value, ALPHABET);

    const [diff, direction] = getDiff(prevSignature, nextSignature);

    startTween(diff, direction);
    startLoop();

    prevSignature = nextSignature;
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
