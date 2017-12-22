import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { ajaxGet, ajaxPost, ajaxPut, ajaxDelete } from "./ajax.js";
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

  static get properties() {
    return {
      path: {
          type: String,
      }
    };
  }

  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }

  render() {
    var inputs = ``;
    var message = ``;
    var buttons = ``;

    if (this.component) {
      inputs = this._createInputs(this.component);
      message = this._createMessage(this.component);
      buttons = this._createButtons(this.component);
    }

    render(html`
    <paper-dialog modal style="min-width: 600px;">
      ${message}
      ${inputs}
      ${buttons}
    </paper-dialog>
    `, this.shadowRoot);
  }

  openDialog(callback) {
    ajaxGet(this.path+".json", (component) => {
      this.component = component;
      this.render();
      var paperDialog = this.shadowRoot.querySelector("paper-dialog")
      paperDialog.open();
      this._attachButtonHandlers();
      this._attachClosedHandlers(callback);
    });
  }

  formValues() {
    var values = {};
    this.shadowRoot.querySelectorAll("paper-input").forEach((input) => {
      if (typeof input.value !== "undefined") {
        values[input.name] = input.value;
      } else {
        values[input.name] = "";
      }
    });
    this.shadowRoot.querySelectorAll("paper-checkbox").forEach((input) => {
      if (typeof input.value !== "undefined") {
        console.log(input.active);
        values[input.name] = input.active;
      } else {
        values[input.name] = false;
      }
    });
    return values;
  }

  _attachClosedHandlers(callback) {
    var paperDialog = this.shadowRoot.querySelector("paper-dialog")

    var dialogClosed = (event) => {
      if (event.detail.confirmed) {
        ajaxPost(this.path, this.formValues());
      }
      paperDialog.removeEventListener("iron-overlay-closed", dialogClosed);
      callback(event.detail.confirmed);
    }
    
    paperDialog.addEventListener("iron-overlay-closed", dialogClosed);
  }

  _attachButtonHandlers() {
    var paperDialog = this.shadowRoot.querySelector("paper-dialog")

    Array.from(paperDialog.querySelectorAll("paper-button.tactile-add")).forEach(button => {
      button.addEventListener("click", (e) => {
        var path = this.path+"/"+e.target.dataset.path;
        var template = JSON.parse(e.target.dataset.template);
        ajaxPut(path, template, callback);
      });
    });

    Array.from(paperDialog.querySelectorAll("paper-button.tactile-delete")).forEach(button => {
      button.addEventListener("click", (e) => {
        ajaxDelete(this.path, callback);
      });
    });
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

    if (! component.author.preventDelete && ! component.preventDelete) {
      var deleteButton = html`
        <paper-button class="tactile-delete" data-path=${this.path}>Delete</paper-button>
      `;
    }

    return html`
      <div class="buttons">
        ${extraButtons}
        ${deleteButton}
        <paper-button dialog-dismiss>Decline</paper-button>
        <paper-button dialog-confirm autofocus>Accept</paper-button>
      </div>`;
  }
}

// Register custom element class with browser
customElements.define(TactileAuthor.is, TactileAuthor);
