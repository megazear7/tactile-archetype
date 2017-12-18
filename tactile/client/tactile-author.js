import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { ajaxGet } from "./ajax.js";
import "@polymer/paper-dialog/paper-dialog";

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

  openDialog() {
    ajaxGet(this.path+".json", (component) => {
      // TODO Open a dialog for editing the data based upon component.author
      // which contains the field list and the rest of that json which contains
      // the actual properties.
      console.log(component);

      var shadow = this.attachShadow({mode: "open"});
      shadow.innerHTML = `
        <paper-dialog modal>
          <h2>${component.compType}</h2>
          <p>We need to loop over the values in component.author and create paper-input elements
             based upon their name and type. Finally we need to submit the values to a POST API
             which is also yet to be created.</p>
        </paper-dialog>`;

      shadow.querySelector("paper-dialog").open();

      // TODO Still need a POST API for updating content.json
    });
  }
}

// Register custom element class with browser
customElements.define(TactileAuthor.is, TactileAuthor);
