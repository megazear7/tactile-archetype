const officer = require('./officer.js')

module.exports = function(dust) {
  function extendPage(page) {
    page.isAuthor = process.env.isAuthor

    if (! page.labels.includes("rootpage")) {
      page.parent = function() {
        return officer.sendQuery(`
          MATCH (parent:page)-[:has_child]->(current:page)
          WHERE ID(current)=${page.identity.toString()}
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
          WHERE ID(current)=${page.identity.toString()}
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
          WHERE ID(current)=${page.identity.toString()}
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
        WHERE ID(current)=${page.identity.toString()}
        RETURN child`)
      .then(results => results.records.map(record => extendPage(record.get('child'))))
      .catch(e => console.error(e))
    }

    page.child = function(path) {
      return officer.sendQuery(`
        MATCH (current:page)-[:has_child {path: "${path}"}]->(child:page)
        WHERE ID(current)=${page.identity.toString()}
        RETURN child`)
      .then(results => results.records.map(record => extendPage(record.get('child'))))
      .catch(e => console.error(e))
    }

    if (! page.labels.includes("rootpage")) {
      page.path = function() {
        return officer.sendQuery(`
          MATCH path = (:rootpage)-[:has_child*]->(current:page)
          WHERE ID(current)=${page.identity.toString()}
          RETURN RELATIONSHIPS(path)`,
          'RELATIONSHIPS(path)')
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

  function extendComponent(component, page, compPath) {
    component.isAuthor = process.env.isAuthor

    if (typeof component.identity === "undefined") {
      component.page = function() {
        return new Promise(function(resolve, reject) {
          resolve(page)
        })
      }
    } else {
      component.page = function() {
        return officer.sendQuery(`
          MATCH (p:page)-[:has_child*]->(c)
          WHERE ID(c)=${component.identity.toString()}
          RETURN p`,
          'p')
        .then(page => extendPage(page))
        .catch(e => console.error(e))
      }
    }

    if (typeof component.identity === "undefined") {
      component.children = function() {
        return new Promise(function(resolve, reject) {
          resolve([])
        })
      }
    } else {
      component.children = function() {
        return officer.sendQuery(`
          MATCH (current)-[r:has_child]->(child)
          WHERE ID(current)=${component.identity.toString()}
          RETURN child, r.path
          ORDER BY r.path`)
        .then(results => results.records.map(result => {
          var component = extendComponent(result.get("child"))
          component.path = result.get("r.path")
          return component
        }))
        .catch(e => console.error(e))
      }
    }

    if (typeof component.identity === "undefined") {
      component.child = function(path) {
        return new Promise(function(resolve, reject) {
          resolve(undefined)
        })
      }
    } else {
      component.child = function(path) {
        return officer.findRelativeNode(component.identity.toString(), path)
        .then(node => {
          var component = extendComponent(node)
          component.path = path
          return component
        })
        .catch(e => console.error(e))
      }
    }

    if (typeof component.identity === "undefined") {
      // If this is a transient component, the parents path needs to have been provided.
      component.path = () => component.parentPath().then(path => {
        if (path === "/") {
          return path + compPath
        } else {
          return path + "/" + compPath
        }
      })
    } else {
      component.path = function() {
        return officer.sendQuery(`
          MATCH path = (:rootpage)-[:has_child*]->(current)
          WHERE ID(current)=${component.identity.toString()}
          RETURN RELATIONSHIPS(path)`,
          'RELATIONSHIPS(path)')
        .then(results => "/" + results.map(result => result.properties.path).join("/"))
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
