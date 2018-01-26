# Tactile Archetype

## Current Status

1. Should I update the officer to be more of an ORM with Page and Component objects instead of just being a list of helper methods. Maybe wrap the officer in an ORM?
1. Need to update components to take data out of neo4j using the associated utility methods.
1. Remove references to Mustache and the npm dependency.

## Local Environment

Run a local environment with "npm run dev"
Install neo4j and have it run on the default port of 7474

### Getting Started

1. Clone this repo
2. Run `npm install`
4. Install neo4j and have it run on the default port of 7474
3. Install seed data: `npm run seed`
3. Run `npm run dev`
5. Visit http://localhost:3000

## About Tactile

### Included sub-modules

* [Tactile Broker](https://github.com/megazear7/tactile-broker)
    * Connects json content with the pages and components.
* [Tactile Clerk](https://github.com/megazear7/tactile-clerk)
    * Integrates an express.js server with Tactile Broker.
* [Tactile Gulp](https://github.com/megazear7/tactile-gulp)
    * Uses gulp to create a frontend build.

### Sub Folders

* components
    * Corresponds to tactype="component" objects in the json content.
* pages
    * Corresponds to tactype="page" objects in the json content.
* global
    * Global css and js to apply on every page.
