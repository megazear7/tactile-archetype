const officer = require('./officer.js')

module.exports = function(dust) {
  function extendPage(page) {
    var pageType = page.properties.pageType

    if (! page.labels.includes("rootpage")) {
      page.parent = function() {
        return new Promise(function(resolve, reject) {
          officer.sendQuery(`
            MATCH (parent:page)-[:has_child]->(current:page)
            WHERE ID(current)=${page._id}
            RETURN parent
            `, 'parent').then(function(parent) {
            resolve(extendPage(parent))
          })
        })
      }
    }

    if (! page.labels.includes("rootpage")) {
      page.home = function() {
        return new Promise(function(resolve, reject) {
          officer.sendQuery(`
            MATCH (home:homepage)-[:has_child*]->(current:page)
            WHERE ID(current)=${page._id}
            RETURN home
            `, 'home').then(function(home) {
            resolve(extendPage(home))
          })
        })
      }
    }

    if (! page.labels.includes("rootpage")) {
      page.root = function() {
        return new Promise(function(resolve, reject) {
          officer.sendQuery(`
            MATCH (root:rootpage)-[:has_child*]->(current:page)
            WHERE ID(current)=${page._id}
            RETURN root
            `, 'root').then(function(root) {
            resolve(extendPage(root))
          })
        })
      }
    }

    page.children = function() {
      return new Promise(function(resolve, reject) {
        officer.sendQuery(`
          MATCH (current:page)-[:has_child]->(child:page)
          WHERE ID(current)=${page._id}
          RETURN child
          `).then(function(results) {
          children = []
          results.forEach(function(result) {
            children.push(extendPage(result["child"]))
          })
          resolve(children)
        })
      })
    }

    return page
  }

  function extendComponent(component) {
    return component
  }

  return {
    extendPage: extendPage,
    extendComponent: extendComponent
  }
}
