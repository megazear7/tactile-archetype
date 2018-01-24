var officer = require("./tactile/officer")

var error = function(err) {
  throw err
}

var success = function(message) {
  return function(result) {
    console.log("---------------------------------------")
    console.log(message)
    console.log(result)
    console.log("")
    console.log("")
    console.log("")
  }
}

officer.findPage("/about/example_sub_page/even_lower_page",
        success("Found '/about/example_sub_page/even_lower_page' page:"),
        error);

officer.findPage("/about", function(aboutPage) {
  officer.getComponents(aboutPage._id,
          success("Found '/about' page, then found component list:"),
          error)
}, error);


officer.findPage("/about", function(aboutPage) {
  officer.getComponent(aboutPage._id, "/content/2",
          success("Found '/about' page, then found '/content/2' component:"),
          error)
}, error);

officer.findPage("/about", function(aboutPage) {
  officer.findRelativePage(aboutPage._id, "/example_sub_page",
          success("Found '/about' page, then found '/example_sub_page' relative page:"),
          error)
}, error);
