module.exports = function(page) {
  page.title = "Home Page"

  page.childLinks = new Promise(function(resolve, reject) {
    page.children().then(function(children) {
      var links = []
      children.forEach(function(child) {
        links.push({
          title: child.properties.title,
          href: child.path()
        })
      })
      resolve(links)
    })
  })
};
