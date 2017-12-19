const init = function(node) {
  return {
    title: "Footer",
    description: "A simple footer component that can have links added to it",
    attrs: [
      {
        type: "Add",
        compType: "link",
        path: "links",
        title: "Add Link"
      }
    ]
  }
};

module.exports = { init: init };
