const init = function(node) {
  return {
    attrs: [
      {name: "title", type: "String"},
      {name: "href", type: "String"}
    ]
  }
};

module.exports = { init: init };
