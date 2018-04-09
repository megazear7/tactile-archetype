module.exports = function(component) {
  component.title = component.page()
  .then(page => page.properties.title)
};
