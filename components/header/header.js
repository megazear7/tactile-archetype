module.exports = function(component) {
  component.links = [{
    href: "/",
    title: "Home",
    isCurrentPage: false
  }]

  component.page = component.page()

  component.title = "Header"
};
