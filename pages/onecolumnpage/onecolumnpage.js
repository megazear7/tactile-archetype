module.exports = function(page) {
  page.title = page.properties.title

  page.rootLink = page.root()
  .then(root => ({
    title: root.properties.title,
    href: root.path()
  }))

  page.homeLink = page.home()
  .then(home => ({
    title: home.properties.title,
    href: home.path()
  }))

  page.parentLink = page.parent()
  .then(parent => ({
    title: parent.properties.title,
    href: parent.path()
  }))

  page.childLinks = page.children()
  .then(children => {
    console.log(children)
    return children.map(child => ({
      title: child.properties.title,
      href: child.path()
    }))
  })
};
