/* eslint no-underscore-dangle: ["error", { "allow": ["_web_component"] }] */
/* eslint-disable import/no-unresolved */

import styles from '../css/main.css?inline';
import createCounter from './counter';

// import { createEl } from './elements';

export default class NiceCounter extends HTMLElement {
  static observedAttributes = ['value', 'duration'];

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

    const webc = createCounter(patternValue, initialValue, defaultValue, {
      duration: this.duration,
    });
    shadowRoot.appendChild(webc.getRootEl());

    this._web_component = webc;
  }

  disconnectedCallback() {
    this._web_component.destroy();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (this._web_component === undefined) return;
    if (oldValue === newValue) return;

    switch (attr) {
      case 'value':
        this._web_component.setValue(newValue);
        break;

      case 'duration':
        this._web_component.setDuration(newValue);
        break;

      default: break;
    }
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newValue = null) {
    if (newValue !== null) {
      this.setAttribute('value', newValue);
    } else {
      this.removeAttribute('value');
    }
  }

  get duration() {
    return this.getAttribute('duration');
  }

  set duration(newDuration = null) {
    if (newDuration !== null) {
      this.setAttribute('duration', newDuration);
    } else {
      this.removeAttribute('duration');
    }
  }
}

window.customElements.define('nice-counter', NiceCounter);
