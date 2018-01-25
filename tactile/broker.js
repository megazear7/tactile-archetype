const dust = require('dustjs-linkedin')
const officer = require('./officer.js')
const components = require('../components/components.js')(dust)
const pages = require('../pages/pages.js')(dust)

var model = function(path, callback) {
  callback({test: "Hello, World!"})
}

var render = function(path, callback) {
  officer.findPage(path, function(page) {
    dust.helpers.render = function(chunk, context, bodies, params) {
      test = new Promise(function(resolve, reject) {
        dust.render('component-'+'header', {}, function(err, out) {
          if (err) {
            throw err
          } else {
            chunk.write(out)
          }
        });
      })
    }

    page.test = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve("Hello, World!")
      }, 1000)
    })

    dust.render('page-'+page.properties.pageType, page, function(err, out) {
      if (err) {
        throw err
      } else {
        callback(out)
      }
    });
  })
}

module.exports = { render: render, model: model }
