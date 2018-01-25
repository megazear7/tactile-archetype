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
`)

officer.sendQuery(`
CREATE (p:page:rootpage:homepage {pageType: "homepage", title: "Home Page"})
RETURN p
`, 'p').then(function(homepage) {
  addHomePageContent(homepage)
  addSubPages(homepage)
})

function addSubPages(homePage) {
  officer.addPage(homePage._id, {
    title:    "What it is",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "about").then(function(aboutPage) {
    addAboutPageSubPages(aboutPage)
    addOneColumnPageContent(aboutPage, addAboutPageContent)
  })

  officer.addPage(homePage._id, {
    title:    "How it works",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "how").then(function(howPage) {
    addOneColumnPageContent(howPage, addHowPageContent)
  })

  officer.addPage(homePage._id, {
    title:    "Modules",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "modules").then(function(modulesPage) {
    addOneColumnPageContent(modulesPage, addModulesPageContent)
  })

  officer.addPage(homePage._id, {
    title:    "Resources",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "resources").then(function(resourcesPage) {
    addOneColumnPageContent(resourcesPage, addResourcesPageContent)
  })
}

function addHomePageContent(homePage) {
  officer.addComponent(homePage._id, {
    compType: "header"
  }, "header")

  officer.addComponent(homePage._id, {
    compType: "compList"
  }, "primary").then(function(component) {
    officer.addComponent(component._id, {
      compType: "heading",
      size:     "h1",
      heading:  "Tactile",
      hasHr:    true,
      subText:  "Some subtext"
    }, "1")

    officer.addComponent(component._id, {
      compType: "text",
      text: "Tactile is a web content management platform composed of interoperable modules."
    }, "2")
  })

  officer.addComponent(homePage._id, {
    compType: "compList"
  }, "secondary").then(function(component) {
    officer.addComponent(component._id, {
      compType: "image"
    }, "1")
  })

  officer.addComponent(homePage._id, {
    compType: "footer"
  }, "footer")
}

function addOneColumnPageContent(oneColumnPage, contentComponentsCallback) {
  officer.addComponent(oneColumnPage._id, {
    compType: "header"
  }, "header")

  officer.addComponent(oneColumnPage._id, {
    compType: "breadcrumbs"
  }, "breadcrumbs")

  officer.addComponent(oneColumnPage._id, {
    compType: "compList"
  }, "content").then(function(component) {
    if (typeof contentComponentsCallback != "undefined") {
      contentComponentsCallback(component)
    }
  })

  officer.addComponent(oneColumnPage._id, {
    compType: "footer"
  }, "footer")
}

function addAboutPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "About Tactile",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Tactile is a web content management platform composed of interoperable modules."
  }, "2")
}

function addHowPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "How does Tactile Work?",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Built on Node.js and NEO4J. Tactile is composed of different modules which can each be used, or not used, providing great flexibility."
  }, "2")
}

function addModulesPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Modules",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Broker, Clerk, Actuary, Officer, Teller"
  }, "2")
}

function addResourcesPageContent(contentComponent) {
  officer.addComponent(contentComponent._id, {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Resources",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent._id, {
    compType: "text",
    text: "Node.js, Mustache, NEO4J"
  }, "2")
}

function addAboutPageSubPages(aboutPage) {
  officer.addPage(aboutPage._id, {
    title:    "Example Sub Page",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "example_sub_page").then(function(exampleSubPage) {
    officer.addPage(exampleSubPage._id, {
      title:    "Even Lower Page",
      tacType:  "page",
      pageType: "onecolumnpage"
    }, "even_lower_page")
  })
}
