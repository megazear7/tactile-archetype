const officer = require('./officer.js')
const generateComponentList = require('../components/components.js')
const generatePageList = require('../pages/pages.js')

module.exports = function(dust) {
  var pages = generatePageList(dust)
  var components = generateComponentList(dust)

  function extendPage(page) {
    var pageType = page.properties.pageType

    if (! page.labels.includes("rootpage")) {
      page.parent = new Promise(function(resolve, reject) {
        officer.sendQuery(`
          MATCH (parent:page)-[:has_child]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN parent
          `, 'parent').then(function(parent) {
          resolve(extendPage(parent))
        })
      })
    }

    if (! page.labels.includes("rootpage")) {
      page.home = new Promise(function(resolve, reject) {
        officer.sendQuery(`
          MATCH (home:homepage)-[:has_child*]->(current:page)
          WHERE ID(current)=${page._id}
          RETURN home
          `, 'home').then(function(home) {
          resolve(extendPage(home))
        })
      })
    }

    if (typeof pages.authorModels[pageType] !== "undefined") {
      page.authorModel = pages.authorModels[pageType](page)
    }

    if (typeof pages.models[pageType] !== "undefined") {
      pages.models[pageType](page)
    }

    return page
  }

  function extendComponent(component) {
    var compType = component.properties.compType

    if (typeof components.authorModels[compType] !== "undefined") {
      component.authorModel = components.authorModels[compType](component)
    }

    if (typeof components.models[compType] !== "undefined") {
      components.models[compType](component)
    }

    return component
  }

  return {
    extendPage: extendPage,
    extendComponent: extendComponent
  }
}
