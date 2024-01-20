import styles from '../scss/main.scss';

const ALPHABET = '0123456789'.split('');

function createEl(tagName, attrs = {}) {
  // element
  const el = document.createElement(tagName);

  // attributes
  Object.keys(attrs).forEach(key => {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

function createGlyphEl(value, isStatic = false) {
  const glyphEl = createEl('span', {
    class: 'nc__glyph' + (isStatic ? ' nc__glyph--static' : ''),
  });

  glyphEl.innerText = value;

  return glyphEl;
}

function createSpinnerEl(alphabet) {
  const spinnerEl = createEl('span', {
    class: 'nc__spinner',
  });

  // create alphabet glyphs
  const size = alphabet.length;
  for (let i = 0; i < size; i++) {
    const glyphEl = createGlyphEl(alphabet[i]);
    spinnerEl.appendChild(glyphEl);
  }

  // create first glyph again for loop
  const glyphEl = createGlyphEl(alphabet[0]);
  spinnerEl.appendChild(glyphEl);

  return spinnerEl;
}

function createSpinner(_value, _isActive) {
  const boxEl = createEl('span', {
    class: 'nc__box',
  });

  const value = _value;
  const index = ALPHABET.indexOf(value);
  const isDigit = index !== -1;
  const isStatic = !isDigit;

  const staticGlyphEl = createGlyphEl(value, true);
  boxEl.appendChild(staticGlyphEl);

  const spinnerEl = isStatic ? null : createSpinnerEl(ALPHABET);
  if (!isStatic) {
    boxEl.appendChild(spinnerEl);
    staticGlyphEl.style.visibility = 'hidden';
  }

  function setActive(isActive) {
    if (spinnerEl === null) return;

    const targetIndex = isActive ? index : 0;
    spinnerEl.style.transform = 'translate3d(0, ' + (-targetIndex * 100) + '%, 0)';
  }
  setActive(_isActive);

  function getEl() {
    return boxEl;
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
