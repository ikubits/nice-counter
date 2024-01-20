import styles from './main.scss';

const ALPHABET = '0123456789'.split('');
const EMPTY = '0';

function createEl(tagName, attrs = {}) {
  // element
  const el = document.createElement(tagName);

  // attributes
  Object.keys(attrs).forEach(key => {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

function createSpinner(_value, _isActive) {
  const spinnerEl = createEl('span', {
    class: 'nc--spinner',
  });

  const value = _value;
  const index = ALPHABET.indexOf(value);
  const isDigit = index !== -1;
  const empty = isDigit ? EMPTY : value;
  const isStatic = !isDigit;

  if (isStatic) spinnerEl.innerText = value;

  function setActive(isActive) {
    if (isStatic) return;

    spinnerEl.innerText = isActive ? value : empty;
  }
  setActive(_isActive);

  function getEl() {
    return spinnerEl;
  }

  function destroy() {

  }

  return {
    getEl,
    setActive,
    destroy,
  };
}

function createWebComponent(_value, _isActive) {
  const valueChars = _value.split('');
  const size = valueChars.length;

    // -- create
  const rootEl = createEl('span', {
    class: 'nc',
  });

  const fragment = document.createDocumentFragment();
  const spinners = [];
  for (let i = 0; i < size; i++) {
    const spinner = createSpinner(valueChars[i], _isActive);

    spinners.push(spinner);

    fragment.appendChild(spinner.getEl());
  }
  rootEl.appendChild(fragment);

  // -- methods

  function setActive(isActive) {
    console.log(isActive);
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

class NiceCounter extends HTMLElement {
  static observedAttributes = ['active'];


  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    // const styleLinkEl = createEl('link', {
    //   rel: 'stylesheet',
    //   href: styles,
    // });
    // shadowRoot.appendChild(styleLinkEl);
    const styleEl = createEl('style');
    styleEl.innerHTML = styles;
    shadowRoot.appendChild(styleEl);

    const webc = createWebComponent(this.textContent.trim(), this.active);
    shadowRoot.appendChild(webc.getRootEl());

    this._web_component = webc;
  }

  disconnectedCallback() {
    this._web_component.destroy();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this._web_component === undefined) return;
    if (attr !== 'active') return;

    this._web_component.setActive(newValue !== null);
  }

  get active() {
    return this.getAttribute('active') !== null;
  }

  set active(value) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }
}

window.customElements.define('nice-counter', NiceCounter);
