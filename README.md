# Tactile Archetype

## Current Status

1. Remove references to Mustache and the npm dependency.
1. Update the broker to return promises.
1. Update the HTTP PUT to append to a "node array". This would be a concept
   built on top of Neo4J.
1. Update the HTTP POST method to set values on a node path.
1. Provide a way for elements to "hook" into neo4j in a reactive way.
1. Use gulp/webpack to build a production bundle using "npm run deploy"
1. Use gulp/webpack to build a deployment hot reload using "npm run serve"
1. Create examples using the server side rendered components for SEO static content.
1. Create examples of using elements for SPA interactive features.
1. JS and CSS Linting.
1. Make this server side renderable on heroku.
1. Use gulp/webpack to build a static production bundle with fully rendered pages using "npm run static".
1. Make the static version able to be hosted on firebase.
1. Make the NEO4J interactive API accesssible on heroku accessed from firebase
1. Integrate service worker caching for offline mode. This could be auto generated
   during the build, or have manual pieces as well. Maybe some custom config file?
1. Abstract out all non application code into a single npm dependency

## Local Environment

Run a local environment with "npm run dev"
Install neo4j and have it run on the default port of 7474

### Getting Started

1. Clone this repo
2. Run `npm install`
4. Install neo4j and have it run on the default port of 7474
3. Install seed data: `npm run seed`
3. Run `npm run author` or `npm run start`
5. Visit http://localhost:3000

## About Tactile

### Sub Folders

* elements
    * Interactive web components.
* components
    * Static server side rendered pieces of reusable dom where elements can be included. Corresponds to tactype="component" objects in the json content.
* pages
    * Static server side rendered pages where components and elements can be included. Corresponds to tactype="page" objects in the json content.
* global
    * Global css and js to apply on every page.
