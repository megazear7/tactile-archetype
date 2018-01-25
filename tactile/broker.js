const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const components = require('../components/components.js')(dust)
const pages = require('../pages/pages.js')(dust)

var model = function(path, callback) {
  officer.findPage(path).then(function(page) {
    callback(page)
  })
}

dust.helpers.render = function(chunk, context, bodies, params) {
  return chunk.map(function(chunk) {
    var currentNodeId = context.get("_id")
    var compPath = params.path

    var renderComponent = function(chunk, component) {
      var compType = component.properties.compType
      var template = 'component-'+compType

      if (typeof components.models[compType] !== "undefined") {
        component.model = components.models[compType](component)
      }

      if (typeof components.authorModels[compType] !== "undefined") {
        component.authorModel = components.authorModels[compType](component)
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

    officer.findComponent(currentNodeId, compPath).then(function(component) {
      renderComponent(chunk, component)
    }, function() {
      renderComponent(chunk, {properties: {compType: params.compType}})
    })
  })
}

var render = function(path, callback) {
  officer.findPage(path).then(function(page) {
    var pageTemplate = 'page-'+page.properties.pageType

    dust.render(pageTemplate, page, function(err, out) {
      if (err) {
        throw err
      } else {
        callback(out)
      }
    })
  })
}

module.exports = { render: render, model: model }
