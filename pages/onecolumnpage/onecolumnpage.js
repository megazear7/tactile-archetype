module.exports = function(page) {
  page.title = page.properties.title
  page.home = page.home()
  page.parent = page.parent()
  page.root = page.root()
};
