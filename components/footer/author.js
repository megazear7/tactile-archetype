const init = function(node) {
  return {
    title: "Footer",
    description: "A simple footer component that can have links added to it",
    preventDelete: true,
    attrs: [
      {
        type: "Add",
        compType: "link",
        path: "links",
        title: "Add Link",
        template: {
          compType: "link",
          href: "/",
          title: "New Link"
        }
      }
    ]
  }
};

module.exports = { init: init };
