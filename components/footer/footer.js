module.exports = function(component) {
  component.links = component.child("links")
  .then(linksNode => linksNode.children())
  .then(links => links.map(link => ({
      compType: link.properties.compType,
      path: ["links", link.path].join("/")
  })))
  .catch(e => {
    console.error(e);
    return [];
  });
};
