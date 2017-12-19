const init = function(node) {
  return {
    title: "Image",
    description: "A multi purpose image component.",
    attrs: [
      {name: "href", type: "String", title: "Relative or absolute url to the image."}
    ]
  }
};

module.exports = { init: init };
