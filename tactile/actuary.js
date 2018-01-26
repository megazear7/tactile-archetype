function extendPage(page) {
  var node  = { }

  node.test = "PAGE FROM ACTUARY"

  return node
};

function extendComponent(component) {
  var node = { }

  node.test = "COMPONENT FROM ACTUARY"

  return node
};

module.exports = {
  extendPage: extendPage,
  extendComponent: extendComponent
}
