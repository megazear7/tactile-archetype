import { ajaxGet } from "./ajax.js"

document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('author')) {
    document.addEventListener("click", (event) => {
      // This stops user from interacting with page in author mode
      event.stopPropagation();
      event.preventDefault();

      var component = event.target.closest(".tactile");
      var authorDefinition = component.querySelector(".tactile-author").dataset;
      var path = authorDefinition.tactilePath;

      ajaxGet(path+".json", (data) => {
        // TODO do stuff with data and authorDefinition
        console.log(data);
        console.log(authorDefinition)
      });
    }, true);
  }
});
