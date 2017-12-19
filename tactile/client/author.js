import "./tactile-author.js";
import "./tactile-mode.js";

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
          document.addEventListener("click", watchForComponentClicks);

          // TODO just reload the component, not the entire page.
          window.location.reload();
        });
      }
    }
  }
};

function setupEditMode() {
  document.addEventListener("click", watchForComponentClicks);
  document.body.classList.add("edit");
}

function setupPublishMode() {
  document.removeEventListener("click", watchForComponentClicks);
  document.body.classList.remove("edit");
}

document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('edit')) {
    document.querySelector("tactile-mode").switchToEdit(setupEditMode);
    document.querySelector("tactile-mode").switchToPublish(setupPublishMode);

    setupEditMode();
  }
});
