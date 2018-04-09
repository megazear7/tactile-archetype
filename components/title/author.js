module.exports = function(node) {
  return {
    title: "Title",
    description: "For displaying the page title of a given page. Should only be used once on each page.",
    attrs: [
      {name: "subText", type: "String", title: "Additional smaller text to appear with the title."}
    ]
  }
};
