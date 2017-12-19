const init = function(node) {
  return {
    title: "Heading",
    description: "A heading component for grouping sections of a page.",
    attrs: [
      {name: "heading", type: "String", title: "Heading text"},
      {name: "subText", type: "String", title: "Sub text"},
      {name: "hasHr",   type: "Boolean", title: "Has underline?"}
    ]
  }
};

module.exports = { init: init };
