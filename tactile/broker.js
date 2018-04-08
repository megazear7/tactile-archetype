const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const actuary = require('./actuary.js')(dust)
const components = require('../components/components.js')(dust)
const pages = require('../pages/pages.js')(dust)

var model = function(path) {
  return officer.findNode(path)
}

function componentRenderer(page) {
  return function(chunk, context, bodies, params) {
    return chunk.map(function(chunk) {
      var currentNodeId = context.get("_id")
      var compPath = params.path

      var renderComponent = function(chunk, component) {
        var compType = component.properties.compType
        var template = 'component-'+compType

        actuary.extendComponent(component, page)

        if (typeof components.authorModels[compType] !== "undefined") {
          component.authorModel = components.authorModels[compType](component)
        }

        if (typeof components.models[compType] !== "undefined") {
          components.models[compType](component)
        }

        dust.render(template, component, function(err, out) {
          if (err) {
            throw err
          } else {
            chunk.write(out)
            chunk.end()
          }
        })
      }

      officer.findComponent(currentNodeId, compPath)
      .then(component => renderComponent(chunk, component))
      .catch(e => renderComponent(chunk, {properties: {compType: params.compType}}))
    })
  }
}

var render = function(path, callback) {
  return officer.findPage(path)
  .then(page => {
    dust.helpers.render = componentRenderer(page)
    var pageType = page.properties.pageType
    var pageTemplate = 'page-'+pageType

    actuary.extendPage(page)

    if (typeof pages.authorModels[pageType] !== "undefined") {
      page.authorModel = pages.authorModels[pageType](page)
    }

    if (typeof pages.models[pageType] !== "undefined") {
      pages.models[pageType](page)
    }

    return new Promise((resolve, reject) => {
      dust.render(pageTemplate, page, (err, out) => {
        if (err) {
          reject(err)
        } else {
          resolve(out)
        }
      })
    })
  })
}

module.exports = { render: render, model: model }
