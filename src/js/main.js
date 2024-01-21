/* eslint no-underscore-dangle: ["error", { "allow": ["_web_component"] }] */

import styles from '../scss/main.scss';
import createCounter from './counter';

// import { createEl } from './elements';

class NiceCounter extends HTMLElement {
  static observedAttributes = ['value'];

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    // // css by internal link
    // const styleLinkEl = createEl('link', {
    //   rel: 'stylesheet',
    //   href: styles,
    // });
    // shadowRoot.appendChild(styleLinkEl);

    // // css by internal style element
    // const styleEl = createEl('style');
    // styleEl.innerHTML = styles;
    // shadowRoot.appendChild(styleEl);

    // css by CSSStyleSheet
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);
    shadowRoot.adoptedStyleSheets.push(styleSheet);

    const defaultValue = this.textContent.trim();
    const patternValue = this.pattern ?? defaultValue;
    const initialValue = this.value ?? defaultValue;

    const webc = createCounter(patternValue, initialValue, defaultValue);
    shadowRoot.appendChild(webc.getRootEl());

    this._web_component = webc;
  }

  disconnectedCallback() {
    this._web_component.destroy();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this._web_component === undefined) return;
    if (attr !== 'value') return;
    if (oldValue === newValue) return;

    // console.log(`"${oldValue}" => "${newValue}"`);
    this._web_component.setValue(newValue);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(counterValue = null) {
    if (counterValue !== null) {
      this.setAttribute('value', counterValue);
    } else {
      this.removeAttribute('value');
    }
  }
}

window.customElements.define('nice-counter', NiceCounter);
