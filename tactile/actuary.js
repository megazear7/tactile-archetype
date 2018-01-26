const officer = require('./officer.js')

function extendPage(page) {
  var node  = { }

  node.test = "PAGE FROM ACTUARY"

  node.parent = new Promise(function(resolve, reject) {
    officer.sendQuery(`
      MATCH (currentPage:page)<-[:has_child]-(parentPage:page)
      WHERE ID(currentPage)=${page._id}
      RETURN parentPage
      `, 'parentPage').then(function(parent) { resolve(parent) })
  })


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
