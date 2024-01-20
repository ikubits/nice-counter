import { createEl } from './elements';
import createSpinner from './spinner';

const ALPHABET = '0123456789'.split('');

export default function createCounter(_value, _isActive) {
  const valueChars = _value.split('');
  const size = valueChars.length;

  // -- create
  const rootEl = createEl('span', {
    class: 'nc',
  });

  const fragment = document.createDocumentFragment();
  const spinners = [];
  for (let i = 0; i < size; i++) {
    const spinner = createSpinner(valueChars[i], _isActive, ALPHABET);
    spinners.push(spinner);
    fragment.appendChild(spinner.getEl());
  }
  rootEl.appendChild(fragment);

  // -- methods
  function setActive(isActive) {
    for (let i = 0; i < size; i++) {
      spinners[i].setActive(isActive);
    }
  }

  function getRootEl() {
    return rootEl;
  }

  function destroy() {
    for (let i = 0; i < size; i++) {
      spinners[i].destroy();
    }
  }

  return {
    getRootEl,
    setActive,
    destroy,
  };
}
