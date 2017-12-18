import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { ajaxGet } from "./ajax.js";

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

      // TODO Still need a POST API for updating content.json
    });
  }
}

// Register custom element class with browser
customElements.define(TactileAuthor.is, TactileAuthor);
