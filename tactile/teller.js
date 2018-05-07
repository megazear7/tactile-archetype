const officer = require("./officer.js")

var update = function(path, data) {
  return officer.findNode(path)
  .then(node => officer.setProperties(node._id, data))
}

var add = function(path, data) {
  return officer.findNode(path)
  .then(node => {
    if (data.node.tacType === "page") {
      return officer.addPage(node._id, data.node, data.path)
    } else if (data.node.tacType === "comp") {
      return officer.addComponent(node._id, data.node, data.path)
    } else {
      return officer.addNode(node._id, data.node, data.path)
    }
  })
}

var append = function(path, data) {
  return officer.findNextIndex(path)
  .then(nextIndex => {
    // TODO Refactor this promise in a promise situation.
    return officer.findNode(path)
    .then(node => {
      if (data.tacType === "page") {
        return officer.addPage(node._id, data, [path, nextIndex].join("/"))
      } else if (data.tacType === "comp") {
        console.log([path, nextIndex].join("/"))
        return officer.addComponent(node._id, data, [path, nextIndex].join("/"))
      } else {
        return officer.addNode(node._id, data, [path, nextIndex].join("/"))
      }
    })
  })
}

var remove = function(path, callback) {
  return officer.findNode(path)
  .then(node => {
    officer.removeNode(node._id)
    return node
  })
}

module.exports = {
  update: update,
  add: add,
  append: append,
  remove: remove
};
