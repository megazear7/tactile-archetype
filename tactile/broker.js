const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const actuary = require('./actuary.js')(dust)

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

      dust.render(template, actuary.extendComponent(component), function(err, out) {
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
    var pageType = page.properties.pageType
    var pageTemplate = 'page-'+pageType

    dust.render(pageTemplate, actuary.extendPage(page), function(err, out) {
      if (err) {
        throw err
      } else {
        callback(out)
      }
    })
  })
}

module.exports = { render: render, model: model }
