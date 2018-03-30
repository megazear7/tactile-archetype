module.exports = function(page) {
  page.title = "Home Page"

  page.childLinks = page.children()
  .then(children => children.map(child => ({
    title: child.properties.title,
    href: child.path()
  })))
};
