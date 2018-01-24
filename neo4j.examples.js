var officer = require("./tactile/officer")

var error = function(err) {
  throw err
}

var success = function(results) {
  console.log(results)
}

officer.findPage("/about/example_sub_page/even_lower_page", success, error);
