import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import {html, render} from 'lit-html';
import { ajaxGet, ajaxPost, ajaxPut, ajaxDelete } from "./ajax.js";
import "@polymer/paper-dialog/paper-dialog";
import "@polymer/paper-button/paper-button";
import "@polymer/iron-icon/iron-icon";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-checkbox/paper-checkbox";
import "@polymer/iron-icons/iron-icons";

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
      },
      inline: {
        type: Boolean,
        default: true
      }
    };
  }

  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }

  connectedCallback() {
    ajaxGet(this.path+".json", (component) => {
      this.component = component;
      this.render();

      var inlineButtons = this.shadowRoot.querySelector(".inline-buttons");

      if (inlineButtons) {
        inlineButtons.style.visibility = "hidden";
        inlineButtons.style.opacity = "0";

        this.addEventListener("mouseenter", () => {
        inlineButtons.style.visibility = "visible";
          inlineButtons.style.opacity = "1";
        });

        this.addEventListener("mouseleave", () => {
          inlineButtons.style.visibility = "hidden";
          inlineButtons.style.opacity = "0";
        });
      }
    });
  }

  render() {
    var content = ``;
    if (this.inline) {
      content = html`<slot></slot>`;
    } else {
      content = html`
      <span class="inline-buttons">
        <h3>${this.component.author.title}</h3>
        ${this._createConfigureableButtons()}
      </span>
      <div style="position: relative;">
        <paper-ripple></paper-ripple>
        <slot></slot>
      </div>`;
    }

    render(html`
    <style>
      .inline-buttons {
        background-color: white;
        position: absolute;
        z-index: 1;
        transition: visibility 0s, opacity 0.2s linear;
        color: #555;
        padding: 7px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
      .inline-buttons paper-icon-button {
        border-radius: 100%;
      }
    </style>
    <paper-dialog modal style="min-width: 600px;">
      ${this._createMessage()}
      ${this._createInputs()}
      ${this._createButtons()}
    </paper-dialog>
    ${content}
    `, this.shadowRoot);
  }

  openDialog(callback) {
    var paperDialog = this.shadowRoot.querySelector("paper-dialog")
    paperDialog.open();
    this._attachButtonHandlers();
    this._attachClosedHandlers(callback);
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

  _createInputs() {
    var inputs = [ ];
    this.component.author.attrs.forEach((input) => {
      if (input.type === "String") {
        inputs.push(
          html`<paper-input
                name=${input.name}
                label=${input.title}
                value=${this.component[input.name]}></paper-input>`);
      } else if (input.type === "Boolean") {
        if (this.component[input.name]) {
          inputs.push(html`<paper-checkbox name=${input.name} checked>${input.title}</paper-checkbox>`);
        } else {
          inputs.push(html`<paper-checkbox name=${input.name}>${input.title}</paper-checkbox>`);
        }
      }
    });
    return inputs;
  }

  _createMessage() {
    return html`
      <h2>${this.component.author.title}</h2>
      <p>${this.component.author.description}</p>`;
  }

  _createConfigureableButtons() {
    var buttons = [ ];
    this.component.author.attrs.forEach((input) => {
      if (input.type === "Add") {
        var button = html`<paper-button
                            class="tactile-add"
                            data-path=${input.path}
                            data-template=${JSON.stringify(input.template)}
                            data-comp-type=${input.compType}>
                            ${input.title}
                          </paper-button>`;

        buttons.push(button);
      }
    });
    return buttons;
  }

  _createButtons() {
    var extraButtons = [ ];

    if (! this.component.author.preventDelete && ! this.component.preventDelete) {
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
customElements.define(TactileEditable.is, TactileEditable);
