const officer = require('./officer.js')
const generateComponentList = require('../components/components.js')
const generatePageList = require('../pages/pages.js')

module.exports = function(dust) {
  var pages = generatePageList(dust)
  var components = generateComponentList(dust)

  function extendPage(page) {
    var pageType = page.properties.pageType
    page.node = { }
    page.node.test = "PAGE FROM ACTUARY"

    page.node.parent = function() {
      return new Promise(function(resolve, reject) {
        officer.sendQuery(`
          MATCH (currentPage:page)<-[:has_child]-(parentPage:page)
          WHERE ID(currentPage)=${page._id}
          RETURN parentPage
          `, 'parentPage').then(function(parent) {
          resolve(extendPage(parent))
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
    component.node = { }
    component.node.test = "COMPONENT FROM ACTUARY"

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
