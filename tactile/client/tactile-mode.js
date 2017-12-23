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
    this.toggle = this.shadowRoot.querySelector("paper-toggle-button");

    this.toggle.addEventListener("iron-change", () => {
      if (this.toggle.checked) {
        this.dispatchEvent(new CustomEvent('switched-to-edit'));
      } else {
        this.dispatchEvent(new CustomEvent('switched-to-publish'));
      }
    });
  }

  switchToEdit() {
    this.toggle.checked = true;
  }

  switchToPublish() {
    this.toggle.checked = false;
  }

  get mode() {
    return this.toggle.checked;
  }
}

// Register custom element class with browser
customElements.define(TactileMode.is, TactileMode);
