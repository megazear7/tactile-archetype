const init = function(node) {
  return {
    title: "Text",
    description: "A multi purpose text component",
    attrs: [
      {name: "text", type: "String", title: "The text to appear"}
    ]
  }
};

module.exports = { init: init };
