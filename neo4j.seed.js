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

async function createStuff() {
  let homepage = await officer.sendQuery(`
  CREATE (p:page:rootpage:homepage {pageType: "homepage", title: "Home Page"})
  RETURN p
  `, 'p');
  await addHomePageContent(homepage)
  await addSubPages(homepage);
  //await officer.close();
}

createStuff();

function addSubPages(homePage) {
  officer.addPage(homePage.identity.toString(), {
    title:    "What it is",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "about").then(function(aboutPage) {
    addAboutPageSubPages(aboutPage)
    addOneColumnPageContent(aboutPage, addAboutPageContent)
  })

  officer.addPage(homePage.identity.toString(), {
    title:    "How it works",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "how").then(function(howPage) {
    addOneColumnPageContent(howPage, addHowPageContent)
  })

  officer.addPage(homePage.identity.toString(), {
    title:    "Modules",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "modules").then(function(modulesPage) {
    addOneColumnPageContent(modulesPage, addModulesPageContent)
  })

  officer.addPage(homePage.identity.toString(), {
    title:    "Resources",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "resources").then(function(resourcesPage) {
    addOneColumnPageContent(resourcesPage, addResourcesPageContent)
  })
}

function addHomePageContent(homePage) {
  officer.addComponent(homePage.identity.toString(), {
    compType: "header"
  }, "header")

  officer.addComponent(homePage.identity.toString(), {
    compType: "compList"
  }, "primary").then(function(component) {
    officer.addComponent(component.identity.toString(), {
      compType: "heading",
      size:     "h1",
      heading:  "Tactile",
      hasHr:    true,
      subText:  "Some subtext"
    }, "1")

    officer.addComponent(component.identity.toString(), {
      compType: "text",
      text: "Tactile is a web content management platform composed of interoperable modules."
    }, "2")
  })

  officer.addComponent(homePage.identity.toString(), {
    compType: "compList"
  }, "secondary").then(function(component) {
    officer.addComponent(component.identity.toString(), {
      compType: "image"
    }, "1")
  })

  officer.addComponent(homePage.identity.toString(), {
    compType: "footer"
  }, "footer").then(function(component) {
    officer.addComponent(component.identity.toString(), {
      compType: "compList"
    }, "links")
  })
}

function addOneColumnPageContent(oneColumnPage, contentComponentsCallback) {
  officer.addComponent(oneColumnPage.identity.toString(), {
    compType: "header"
  }, "header")

  officer.addComponent(oneColumnPage.identity.toString(), {
    compType: "breadcrumbs"
  }, "breadcrumbs")

  officer.addComponent(oneColumnPage.identity.toString(), {
    compType: "compList"
  }, "content").then(function(component) {
    if (typeof contentComponentsCallback != "undefined") {
      contentComponentsCallback(component)
    }
  })

  officer.addComponent(oneColumnPage.identity.toString(), {
    compType: "footer"
  }, "footer")
}

function addAboutPageContent(contentComponent) {
  officer.addComponent(contentComponent.identity.toString(), {
    compType: "heading",
    size:     "h1",
    heading:  "About Tactile",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent.identity.toString(), {
    compType: "text",
    text: "Tactile is a web content management platform composed of interoperable modules."
  }, "2")
}

function addHowPageContent(contentComponent) {
  officer.addComponent(contentComponent.identity.toString(), {
    compType: "heading",
    size:     "h1",
    heading:  "How does Tactile Work?",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent.identity.toString(), {
    compType: "text",
    text: "Built on Node.js and NEO4J. Tactile is composed of different modules which can each be used, or not used, providing great flexibility."
  }, "2")
}

function addModulesPageContent(contentComponent) {
  officer.addComponent(contentComponent.identity.toString(), {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Modules",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent.identity.toString(), {
    compType: "text",
    text: "Broker, Clerk, Actuary, Officer, Teller"
  }, "2")
}

function addResourcesPageContent(contentComponent) {
  officer.addComponent(contentComponent.identity.toString(), {
    compType: "heading",
    size:     "h1",
    heading:  "Tactile Resources",
    hasHr:    true,
    subText:  "Some subtext"
  }, "1")

  officer.addComponent(contentComponent.identity.toString(), {
    compType: "text",
    text: "Node.js, Mustache, NEO4J"
  }, "2")
}

function addAboutPageSubPages(aboutPage) {
  officer.addPage(aboutPage.identity.toString(), {
    title:    "Example Sub Page",
    tacType:  "page",
    pageType: "onecolumnpage"
  }, "example_sub_page").then(function(exampleSubPage) {
    officer.addPage(exampleSubPage.identity.toString(), {
      title:    "Even Lower Page",
      tacType:  "page",
      pageType: "onecolumnpage"
    }, "even_lower_page")
  })
}
