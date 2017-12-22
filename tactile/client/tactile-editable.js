import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import {html, render} from 'lit-html';

export default class TactileEditable extends PolymerElement {
  static get is() {
    return "tactile-editable";
  }

  static get properties() {
    return {
      path: {
          type: String,
      },
      compType: {
          type: String,
      }
    };
  }

  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }

  connectedCallback() {
    this.render();
  }

  render() {
    render(html`
    <tactile-author
       path=${this.path}
       comp-type=${this.compType}>
    </tactile-author>
    <paper-ripple></paper-ripple>
    <slot></slot>
    `, this.shadowRoot);
  }

  openDialog(callback) {
    this.shadowRoot.querySelector("tactile-author").openDialog(function(requiresRefresh = true) {
      document.addEventListener("click", callback);

      // TODO just reload the component, not the entire page.
      if (requiresRefresh) {
        window.location.reload();
      }
    });
  }
}

// Register custom element class with browser
customElements.define(TactileEditable.is, TactileEditable);
