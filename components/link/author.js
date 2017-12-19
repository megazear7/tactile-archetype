const init = function(node) {
  return {
    title: "Link",
    description: "A multi purpose link component.",
    attrs: [
      {name: "title", type: "String", title: "The viewable text of the link."},
      {name: "href", type: "String", title: "The url destination of the link."}
    ]
  }
};

module.exports = { init: init };
