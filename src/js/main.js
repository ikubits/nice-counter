/* eslint no-underscore-dangle: ["error", { "allow": ["_web_component"] }] */

import styles from '../scss/main.scss';
import createCounter from './counter';

import { createEl } from './elements';

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

    const webc = createCounter(this.textContent.trim(), this.active);
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
