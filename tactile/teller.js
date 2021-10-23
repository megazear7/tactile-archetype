const officer = require("./officer.js")

var update = function(path, data) {
  return officer.findNode(path)
  .then(node => officer.setProperties(node.identity.toString(), data))
}

var add = function(path, data) {
  return officer.findNode(path)
  .then(node => {
    if (data.node.tacType === "page") {
      return officer.addPage(node.identity.toString(), data.node, data.path)
    } else if (data.node.tacType === "comp") {
      return officer.addComponent(node.identity.toString(), data.node, data.path)
    } else {
      return officer.addNode(node.identity.toString(), data.node, data.path)
    }
  })
}

var append = function(path, data) {
  console.log('A', path)
  return officer.findNextIndex(path)
  .then(nextIndex => {
    console.log('B', nextIndex);
    // TODO Refactor this promise in a promise situation.
    return officer.findNode(path)
    .then(node => {
      if (data.tacType === "page") {
        return officer.addPage(node.identity.toString(), data, nextIndex)
      } else if (data.tacType === "comp") {
        console.log('C', node);
        return officer.addComponent(node.identity.toString(), data, nextIndex)
      } else {
        return officer.addNode(node.identity.toString(), data, nextIndex)
      }
    })
  })
}

var remove = function(path, callback) {
  return officer.findNode(path)
  .then(node => {
    officer.removeNode(node.identity.toString())
    return node
  })
}

module.exports = {
  update: update,
  add: add,
  append: append,
  remove: remove
};
