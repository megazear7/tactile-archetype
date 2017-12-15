import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import view from './tta-underlined-text.html';

// TODO we need to wait for the polyfills before using PolymerElement.
class TTAUnderlinedText extends PolymerElement {
  static get is() {
    return "tta-underlined-text";
  }

  static get template() {
    return view;
  }

  constructor() {
    super();
  }

  
  static get properties() {
    return {
      text: {
          type: String,
      },
      hasHr: {
          type: Boolean,
      }
    };
  }
}

// Register custom element class with browser
customElements.define(TTAUnderlinedText.is, TTAUnderlinedText);
