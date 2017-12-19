import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import "@polymer/paper-toggle-button/paper-toggle-button";
import {html, render} from 'lit-html';

export default class TactileMode extends PolymerElement {
  static get is() {
    return "tactile-mode";
  }

  static get template() {
    return "<paper-toggle-button>Edit</paper-toggle-button>";
  }

  connectedCallback() {
    super.connectedCallback();
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
  }

  setToEdit() {
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.checked = true;
  }

  setToPublish() {
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.checked = true;
  }

  switchedToEdit(callback) {
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.addEventListener("iron-change", () => {
      if (toggle.checked) {
        callback();
      }
    });
  }

  switchedToPublish(callback) {
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.addEventListener("iron-change", () => {
      if (! toggle.checked) {
        callback();
      }
    });
  }
}

// Register custom element class with browser
customElements.define(TactileMode.is, TactileMode);
