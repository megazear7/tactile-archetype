
document.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('author')) {
    document.addEventListener("click", (event) => {
      // This stops user from interacting with page in author mode
      event.stopPropagation();
      event.preventDefault();
      var component = event.target.closest(".tactile");
      console.log(component);
      // TODO fo stuff with
    },true);
  }
});
