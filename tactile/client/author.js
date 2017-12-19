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
  window.sessionStorage.setItem("tactile-mode", "edit");
}

function setupPublishMode() {
  document.removeEventListener("click", watchForComponentClicks);
  document.body.classList.remove("edit");
  window.sessionStorage.setItem("tactile-mode", "publish");
}

document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('edit')) {
    var tactileModeToggle = document.querySelector("tactile-mode");
    tactileModeToggle.switchedToEdit(setupEditMode);
    tactileModeToggle.switchedToPublish(setupPublishMode);

    var mode = window.sessionStorage.getItem("tactile-mode");

    if (mode === "edit") {
      tactileModeToggle.setToEdit();
    } else {
      setupPublishMode();
    }
  }
});
