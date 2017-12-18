import { TactileAuthor } from "./tactile-author.js";

document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('author')) {
    document.addEventListener("click", (event) => {
      // This stops user from interacting with page in author mode
      event.stopPropagation();
      event.preventDefault();

      var component = event.target.closest(".tactile");
      var authorElement = component.querySelector("tactile-author");
      var path = authorElement.getAttribute("path");

      authorElement.openDialog();
    }, true);
  }
});
