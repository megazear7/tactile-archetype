import { TactileAuthor } from "./tactile-author.js";

document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('author')) {
    function watchForComponentClicks(event) {
      // This stops user from interacting with page in author mode
      event.stopPropagation();
      event.preventDefault();

      var component = event.target.closest(".tactile");
      if (component) {
        var authorElement = component.querySelector("tactile-author");
        if (authorElement) {
          var path = authorElement.getAttribute("path");

          if (authorElement) {
            document.removeEventListener("click", watchForComponentClicks);

            authorElement.openDialog(function() {
              authorClickHandler()
              window.location.reload();
            });
          }
        }
      }
    };

    function authorClickHandler() {
      document.addEventListener("click", watchForComponentClicks);
    }

    authorClickHandler();
  }
});
