import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { ajaxGet, ajaxPost, ajaxPut } from "./ajax.js";
import {html, render} from 'lit-html';
import { camelCaseToTitle } from './stringUtils.js';
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
                label=${input.title}
                value=${component[input.name]}></paper-input>`);
      } else if (input.type === "Boolean") {
        if (component[input.name]) {
          inputs.push(html`<paper-checkbox name=${input.name} checked>${input.title}</paper-checkbox>`);
        } else {
          inputs.push(html`<paper-checkbox name=${input.name}>${input.title}</paper-checkbox>`);
        }
      }
    });
    return inputs;
  }

  _createMessage(component) {
    return html`
      <h2>${component.author.title}</h2>
      <p>${component.author.description}</p>`;
  }

  _createButtons(component) {
    var extraButtons = [ ];
    component.author.attrs.forEach((input) => {
      if (input.type === "Add") {
        var button = html`<paper-button
                            class="tactile-add"
                            data-path=${input.path}
                            data-template=${JSON.stringify(input.template)}
                            data-comp-type=${input.compType}>
                            ${input.title}
                          </paper-button>`;

        extraButtons.push(button);
      }
    });

    return html`
      <div class="buttons">
        ${extraButtons}
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
      var buttons = this._createButtons(component);

      render(html`
        <paper-dialog modal style="min-width: 600px;">
          ${message}
          ${inputs}
          ${buttons}
        </paper-dialog>`, shadow);

      var paperDialog = shadow.querySelector("paper-dialog")
      paperDialog.open();

      paperDialog.querySelector("paper-button").addEventListener("click", (e) => {
        if (e.target.classList.contains("tactile-add")) {
          var path = this.path+"/"+e.target.dataset.path;
          var template = JSON.parse(e.target.dataset.template);
          ajaxPut(path, template, callback);
        }
      });

      var ironOverlayClosedHandler = (e) => {
        // TODO Inspect the input elements for the values to send over a POST
        // API for updating content.json
        if (e.detail.confirmed) {
          var newValues = {};
          shadow.querySelectorAll("paper-input").forEach((input) => {
            if (typeof input.value !== "undefined") {
              newValues[input.name] = input.value;
            } else {
              newValues[input.name] = "";
            }
          });
          shadow.querySelectorAll("paper-checkbox").forEach((input) => {
            if (typeof input.value !== "undefined") {
              console.log(input.active);
              newValues[input.name] = input.active;
            } else {
              newValues[input.name] = false;
            }
          });
          ajaxPost(this.path, newValues);
        }

        paperDialog.removeEventListener("iron-overlay-closed", ironOverlayClosedHandler);
        callback();
      }

      paperDialog.addEventListener("iron-overlay-closed", ironOverlayClosedHandler);
    });
  }
}

// Register custom element class with browser
customElements.define(TactileAuthor.is, TactileAuthor);
