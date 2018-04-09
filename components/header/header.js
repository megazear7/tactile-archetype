module.exports = function(component) {
  component.links = component.page()
  .then(page => page.home())
  .then(home => home.children())
  .then(children => children.map(child => ({
    href: child.path(),
    title: child.properties.title,
    isCurrentPage: false
  })))
  .then(links => {
    links.unshift({
      href: "/",
      title: "Home",
      isCurrentPage: false
    });
    return links;
  });
};
