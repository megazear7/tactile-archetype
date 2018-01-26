module.exports = function(component) {
  component.childComponents = new Promise(function(resolve, reject) {
    component.children().then(function(children) {
      var components = []
      children.forEach(function(child) {
        components.push({
          compType: child.properties.compType
        })
      })
      resolve(components)
    })
  })
};
