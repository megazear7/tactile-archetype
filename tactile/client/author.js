import "./tactile-author.js";
import "./tactile-mode.js";

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

              // TODO just reload the component, not the entire page.
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
