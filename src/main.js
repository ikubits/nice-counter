import styles from './main.scss';

const DIGITS = '0123456789'.split('');

function createEl(tagName, attrs = {}) {
  // element
  const el = document.createElement(tagName);

  // attributes
  Object.keys(attrs).forEach(key => {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

function createWebComponent(_value, _isActive) {
  const valueChars = _value.split('');
  const size = valueChars.length;

    // -- create
  const rootEl = createEl('span', {
    class: 'nc',
  });

  const fragment = document.createDocumentFragment();
  const charObjs = [];
  for (let i = 0; i < size; i++) {
    const charEl = createEl('span', {
      class: 'nc--char',
    });

    const char = valueChars[i];
    const isDigit = DIGITS.includes(char)
    const charObj = {
      el: charEl,
      value: char,
      empty: isDigit ? '0' : char,
      isStatic: !isDigit,
    };

    charEl.innerText = _isActive ? valueChars[i] : emptyChars[i];
    fragment.appendChild(charEl);
    charObjs.push(charObj);
  }
  rootEl.appendChild(fragment);

  // -- methods

  function setActive(isActive) {
    console.log(isActive);
    for (let i = 0; i < size; i++) {
      const { el, value, empty, isStatic } = charObjs[i];
      if (isStatic) continue;

      el.innerText = isActive ? value : empty;
    }
  }

  function getRootEl() {
    return rootEl;
  }

  function destroy() {

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
