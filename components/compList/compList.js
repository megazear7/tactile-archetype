module.exports = function(component) {
  component.childComponents = component.children()
  .then(children => children.map(child => ({
    compType: child.properties.compType,
    path: child.path
  })))
};
