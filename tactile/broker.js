const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const components = require('../components/components.js')(dust)
const pages = require('../pages/pages.js')(dust)

var model = function(path, callback) {
  callback({test: "Hello, World!"})
}

var render = function(path, callback) {
  officer.findPage(path).then(function(page) {
    var pageTemplate = 'page-'+page.properties.pageType

    dust.helpers.render = function(chunk, context, bodies, params) {
      return chunk.map(function(chunk) {
        var currentNodeId = context.get("_id")
        var compPath = params.path

        officer.findComponent(currentNodeId, compPath).then(function(component) {
          var componentTemplate = params.compType ? 'component-'+params.compType : 'component-'+component.properties.compType

          dust.render(componentTemplate, component, function(err, out) {
            if (err) {
              throw err
            } else {
              chunk.write(out)
              chunk.end()
            }
          })
        })
      })
    }

    page.test = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("Hello, World!")
      }, 500)
    })

    dust.render(pageTemplate, page, function(err, out) {
      if (err) {
        throw err
      } else {
        callback(out)
      }
    });
  })
}

module.exports = { render: render, model: model }
