module.exports = function(page) {
  page.title = page.properties.title
  
  page.rootLink = new Promise(function(resolve, reject) {
    page.root().then(function(root) {
      resolve({
        title: root.properties.title,
        href: root.path()
      })
    })
  })

  page.homeLink = new Promise(function(resolve, reject) {
    page.home().then(function(home) {
      resolve({
        title: home.properties.title,
        href: home.path()
      })
    })
  })

  page.parentLink = new Promise(function(resolve, reject) {
    page.parent().then(function(parent) {
      resolve({
        title: parent.properties.title,
        href: parent.path()
      })
    })
  })

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
