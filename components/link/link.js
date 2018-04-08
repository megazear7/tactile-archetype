module.exports = function(component) {
  component.isExternal = component.properties.href.indexOf("/") !== 0;

  component.isCurrentPage = component.page()
  .then(page => page.path())
  .then(path => path === component.properties.href)
};
