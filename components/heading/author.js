const init = function(node) {
  return {
    attrs: [
      {name: "heading", type: "String"},
      {name: "subText", type: "String"},
      {name: "hasHr",   type: "Boolean"}
    ]
  }
};

module.exports = { init: init };
