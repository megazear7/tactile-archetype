const officer = require('./officer.js')

module.exports = function(dust) {
  function extendPage(page) {
    if (! page.labels.includes("rootpage")) {
      page.parent = function() {
        return officer.sendQuery(`
          MATCH (parent:page)-[:has_child]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN parent`,
          'parent')
        .then(parent => extendPage(parent))
        .catch(e => console.error(e))
      }
    } else {
      page.parent = function() {
        return new Promise(function(resolve, reject) {
          resolve({})
        })
      }
    }

    if (! page.labels.includes("rootpage")) {
      page.home = function() {
        return officer.sendQuery(`
          MATCH (home:homepage)-[:has_child*]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN home`,
          'home')
        .then(home => extendPage(home))
        .catch(e => console.error(e))
      }
    } else {
      page.home = function() {
        return new Promise(function(resolve, reject) {
          resolve(page)
        })
      }
    }

    if (! page.labels.includes("rootpage")) {
      page.root = function() {
        return officer.sendQuery(`
          MATCH (root:rootpage)-[:has_child*]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN root`,
          'root')
        .then(root => extendPage(root))
        .catch(e => console.error(e))
      }
    } else {
      page.root = function() {
        return new Promise(function(resolve, reject) {
          resolve(page)
        })
      }
    }

    page.children = function() {
      return officer.sendQuery(`
        MATCH (current:page)-[:has_child]->(child:page)
        WHERE ID(current)=${page._id}
        RETURN child`)
      .then(results => results.map(result => extendPage(result['child'])))
      .catch(e => console.error(e))
    }

    if (! page.labels.includes("rootpage")) {
      page.path = function() {
        return officer.sendQuery(`
          MATCH path = (:rootpage)-[:has_child*]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN RELATIONSHIPS(path)
          `, 'RELATIONSHIPS(path)')
        .then(results => "/" + results.map(result => result.properties.path).join("/"))
        .catch(e => console.error(e))
      }
    } else {
      page.path = function() {
        return new Promise(function(resolve, reject) {
          resolve("/")
        })
      }
    }

    return page
  }

  function extendComponent(component, page) {
    if (typeof component._id === "undefined") {
      component.page = function() {
        return new Promise(function(resolve, reject) {
          resolve(page)
        })
      }
    } else {
      component.page = function() {
        return officer.sendQuery(`
          MATCH (p:page)-[:has_component*]->(c:component)
          WHERE ID(c)=${component._id}
          RETURN p`,
          'p')
        .then(page => extendPage(page))
        .catch(e => console.error(e))
      }
    }


    if (typeof component._id === "undefined") {
      component.children = function() {
        return new Promise(function(resolve, reject) {
          resolve([])
        })
      }
    } else {
      component.children = function() {
        return officer.sendQuery(`
          MATCH (current:component)-[r:has_component]->(child:component)
          WHERE ID(current)=${component._id}
          RETURN child, r.path
          ORDER BY r.path
          `)
        .then(results => results.map(result => {
          var component = extendComponent(result["child"])
          component.path = result["r.path"]
          return component
        }))
        .catch(e => console.error(e))
      }
    }

    return component
  }

  return {
    extendPage: extendPage,
    extendComponent: extendComponent
  }
}
