module.exports = function(page) {
  page.title = page.properties.title
  page.parent = page.node.parent()
};
