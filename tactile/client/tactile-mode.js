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
        this.switchToEdit();
        this.dispatchEvent(new CustomEvent('switched-to-edit'));
      } else {
        this.switchToPublish();
        this.dispatchEvent(new CustomEvent('switched-to-publish'));
      }
    });

    var mode = window.sessionStorage.getItem("tactile-mode");
    if (mode === "edit") {
      this.switchToEdit();
    } else {
      this.switchToPublish();
    }
  }

  switchToEdit() {
    this.toggle.checked = true;
    document.addEventListener("click", TactileMode.watchForComponentClicks);
    window.sessionStorage.setItem("tactile-mode", "edit");
  }

  switchToPublish() {
    this.toggle.checked = false;
    document.removeEventListener("click", TactileMode.watchForComponentClicks);
    window.sessionStorage.setItem("tactile-mode", "publish");
  }

  get mode() {
    return this.toggle.checked;
  }

  static watchForComponentClicks(event) {
    // This stops user from interacting with page in author mode
    event.stopPropagation();
    event.preventDefault();

    var tactileEditable = event.target.closest("tactile-editable");
    if (tactileEditable) {
      document.removeEventListener("click", TactileMode.watchForComponentClicks);

      tactileEditable.openDialog(function(requiresRefresh = true) {
        document.addEventListener("click", TactileMode.watchForComponentClicks);

        // TODO just reload the component, not the entire page.
        if (requiresRefresh) {
          window.location.reload();
        }
      });
    }
  }
}

// Register custom element class with browser
customElements.define(TactileMode.is, TactileMode);
