import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import "@polymer/paper-toggle-button/paper-toggle-button";
import {html, render} from 'lit-html';

export default class TactileMode extends PolymerElement {
  static get is() {
    return "tactile-mode";
  }

  static get template() {
    return "<paper-toggle-button checked>Edit</paper-toggle-button>";
  }

  connectedCallback() {
    super.connectedCallback();
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.addEventListener("iron-change", () => {
      if (toggle.checked) {
        // TODO turn on author functionality
      } else {
        // TODO turn off author functionality
      }
    });
  }

  switchToEdit(callback) {
    var toggle = this.shadowRoot.querySelector("paper-toggle-button");
    toggle.addEventListener("iron-change", () => {
      if (toggle.checked) {
        callback();
      }
    });
  }

  switchToPublish(callback) {
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
