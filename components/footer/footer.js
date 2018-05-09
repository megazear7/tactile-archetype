module.exports = function(component) {
  component.links = component.child("links")
  .then(linksNode => linksNode.children())
  .then(links => {
    console.log(links)
    return links.map(link => ({
      compType: link.properties.compType,
      path: ["links", link.path].join("/")
    }))
  })
  .then(links => {
    console.log("A")
    console.log(links)
    return links
  })
  .catch(e => {
    console.error(e);
    return [];
  });
};
