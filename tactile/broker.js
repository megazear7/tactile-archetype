const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const actuary = require('./actuary.js')(dust)
const components = require('../components/components.js')(dust)
const pages = require('../pages/pages.js')(dust)

var model = function(path) {
  return officer.findNode(path)
}

const componentWrap = (markup, path, compType, transient) => `
  <tactile-editable path="${path}" comp-type="${compType}" ${transient ? 'transient' : ''}>
    ${markup}
  </tactile-editable>`

function componentRenderer(page) {
  return function(chunk, context, bodies, params) {
    return chunk.map(function(chunk) {
      var currentNodeId = context.get("identity").toString()
      var compPath = params.path

      var renderComponent = function(chunk, component) {
        var compType = component.properties.compType
        var template = 'component-'+compType
        const transient = component.transient ? true : false

        actuary.extendComponent(component, page, compPath)

        const authorable = typeof components.authorModels[compType] !== "undefined"

        if (authorable) {
          component.authorModel = components.authorModels[compType](component)
        }

        if (typeof components.models[compType] !== "undefined") {
          components.models[compType](component)
        }

        dust.render(template, component, function(err, out) {
          if (err) {
            throw err
          } else {
            component.path()
            .then(path => {
              if (authorable && process.env.isAuthor) {
                chunk.write(componentWrap(out, path, compType, transient))
              } else {
                chunk.write(out)
              }
              chunk.end()
            })
          }
        })
      }

      officer.findComponent(currentNodeId, compPath)
      .then(component => renderComponent(chunk, component))
      .catch(e => {
        renderComponent(chunk, {
          transient: true,
          parentPath: context.get("path"),
          properties: {
            compType: params.compType
          }
        })
      })
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
