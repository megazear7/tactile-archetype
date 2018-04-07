const officer = require("./officer.js")

var update = function(path, data) {
  return officer.findNode(path)
  .then(node => officer.setProperties(node._id, data))
}

var add = function(path, data) {
  return officer.findNode(path)
  .then(node => {
    if (data.node.tacType == "page") {
      officer.addPage(node._id, data.node, data.path)
    } else if (data.node.tacType == "comp") {
      officer.addComponent(node._id, data.node, data.path)
    } else {
      throw new Error("tacType must be either 'page' or 'comp'")
    }
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
  remove: remove
};
