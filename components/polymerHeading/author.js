const init = function(node) {
  return {
    title: "Polymer Heading",
    description: "A heading component implemented with a polymer element",
    attrs: [
      {name: "heading", type: "String", title: "Heading text"},
      {name: "subText", type: "String", title: "Sub text"},
      {name: "hasHr",   type: "Boolean", title: "Has underline?"}
    ]
  }
};

module.exports = { init: init };
