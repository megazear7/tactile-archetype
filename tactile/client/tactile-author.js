import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { ajaxGet, ajaxPost } from "./ajax.js";
import {html, render} from 'lit-html';
import "@polymer/paper-dialog/paper-dialog";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-checkbox/paper-checkbox";

export default class TactileAuthor extends PolymerElement {
  static get is() {
    return "tactile-author";
  }

  constructor() {
    super();
  }

  static get properties() {
    return {
      path: {
          type: String,
      }
    };
  }

  _createInputs(component) {
    var inputs = [ ];
    component.author.attrs.forEach((input) => {
      if (input.type === "String") {
        inputs.push(
          html`<paper-input
                name=${input.name}
                label=${input.name}
                value=${component[input.name]}></paper-input>`);
      } else if (input.type === "Boolean") {
        inputs.push(
          html`<paper-checkbox
                name=${input.name}
                checked=${component[input.name]}>${input.name}</paper-checkbox>`);
      }
    });
    return inputs;
  }

  _createMessage(component) {
    return html`
      <h2>${component.compType}</h2>
      <p>We need to loop over the values in component.author and create paper-input elements
         based upon their name and type. Finally we need to submit the values to a POST API
         which is also yet to be created.</p>`;
  }

  _createButtons() {
    return html`
      <div class="buttons">
        <paper-button dialog-dismiss>Decline</paper-button>
        <paper-button dialog-confirm autofocus>Accept</paper-button>
      </div>`;
  }

  openDialog(callback) {
    ajaxGet(this.path+".json", (component) => {
      var shadow = this.shadowRoot;
      if (! this.shadowRoot) {
        shadow = this.attachShadow({mode: "open"});
      }

      var inputs = this._createInputs(component);
      var message = this._createMessage(component);
      var buttons = this._createButtons();

      render(html`
        <paper-dialog modal>
          ${message}
          ${inputs}
          ${buttons}
        </paper-dialog>`, shadow);

      var paperDialog = shadow.querySelector("paper-dialog")
      paperDialog.open();
      paperDialog.addEventListener("iron-overlay-closed", (e) => {
        // TODO Inspect the input elements for the values to send over a POST
        // API for updating content.json
        var newValues = {};
        shadow.querySelectorAll("paper-input").forEach((input) => {
          newValues[input.name] = input.value;
        });
        shadow.querySelectorAll("paper-checkbox").forEach((input) => {
          newValues[input.name] = input.value === "on";
        });
        ajaxPost(this.path, newValues, (data) => {
          console.log(data);
        });
        callback();
      });
    });
  }
}

// Register custom element class with browser
customElements.define(TactileAuthor.is, TactileAuthor);
