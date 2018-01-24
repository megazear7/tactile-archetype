var officer = require("./tactile/officer")

var error = function(err) {
  throw err
}

var success = function(results) {
  console.log(results)
}

officer.sendQuery(`
MATCH (n)
DETACH DELETE n
`, success, error)

officer.sendQuery(`
CREATE (p:page:rootpage:homepage {pageType: "homepage", title: "Home Page"})
RETURN p
`, function(result) {
  addSubPages(result)
}, error, "p")

function addSubPages(homePage) {
  officer.addPage(homePage._id, {
    title:    "What it is",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "about", function(aboutPage) {
    addAboutPageSubPages(aboutPage)
    addOneColumnPageContent(aboutPage, addAboutPageContent)
  }, error)

  officer.addPage(homePage._id, {
    title:    "How it works",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "how", function(aboutPage) {
    addOneColumnPageContent(aboutPage, addHowPageContent)
  }, error)

  officer.addPage(homePage._id, {
    title:    "Modules",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "modules", function(aboutPage) {
    addOneColumnPageContent(aboutPage, addModulesPageContent)
  }, error)

  officer.addPage(homePage._id, {
    title:    "Resources",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "resources", function(aboutPage) {
    addOneColumnPageContent(aboutPage, addResourcesPageContent)
  }, error)
}

function addOneColumnPageContent(aboutPage, contentComponentsCallback) {
  officer.addComponent(aboutPage._id, {
    compType: "header"
  }, "header", success, error)

  officer.addComponent(aboutPage._id, {
    compType: "breadcrumbs"
  }, "breadcrumbs", success, error)

  officer.addComponent(aboutPage._id, {
    compType: "compList"
  }, "content", function(component) {
    if (typeof contentComponentsCallback != "undefined") {
      contentComponentsCallback(component)
    }
  }, error)

  officer.addComponent(aboutPage._id, {
    compType: "footer"
  }, "footer", success, error)
}

function addAboutPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "About Tactile",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1", success, error)

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Tactile is a web content management platform composed of interoperable modules."
  }, "2", success, error)
}

function addHowPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "How does Tactile Work?",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1", success, error)

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Built on Node.js and NEO4J. Tactile is composed of different modules which can each be used, or not used, providing great flexibility."
  }, "2", success, error)
}

function addModulesPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Modules",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1", success, error)

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Broker, Clerk, Actuary, Officer, Teller"
  }, "2", success, error)
}

function addResourcesPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Resources",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1", success, error)

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Node.js, Mustache, NEO4J"
  }, "2", success, error)
}

function addAboutPageSubPages(aboutPage) {
  officer.addPage(aboutPage._id, {
    title:    "Example Sub Page",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "example_sub_page", function(exampleSubPage) {
    officer.addPage(exampleSubPage._id, {
      title:    "Even Lower Page",
      tacType:  "page",
      pageType: "onecolumnpage"
    }, "even_lower_page", success, error)
  }, error)
}
