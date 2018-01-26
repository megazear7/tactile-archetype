module.exports = function(page) {
  return {
    title: "One Column Page",
    parent: page.node.parent()
  }
};
