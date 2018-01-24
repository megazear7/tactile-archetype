var officer = require("./tactile/officer")

var error = function(err) {
  throw err
}

var success = function(results) {
  console.log(results)
}

officer.findPage("/about/example_sub_page/even_lower_page", success, error);

officer.findPage("/about", function(aboutPage) {
  officer.getComponents(aboutPage._id, success, error)
}, error);

officer.findPage("/about", function(aboutPage) {
  officer.findRelativePage(aboutPage._id, "/example_sub_page", success, error)
}, error);
