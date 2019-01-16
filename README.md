# Tactile Archetype

## Current Status

Currently this project is in an early stage and is mostly just a proof of concept. I work on it as I find the time to.

Version 0.1.1

## About Tactile

Tactile is a content management system (CMS) built upon the Neo4j graph database. It's goals are as follows:

1. Build a CMS on the back of Neo4j.
    * This provides the power of both contextual CMS and headless CMS. The idea here is that your content is in nodes in the graph and different types of edges in that graph connect that content in different ways. A website might use a specific type of edge for organizing a hierarchy of web pages and content. An API might connect the nodes with a different edge type in order to provide the data in the style of a headless CMS. A phone app might use yet another edge type for organizing the same data for use in a native mobile app.
2. Abstract itself away. The goal is that tactile is abstracted out of the project code in two ways:
    1. It should exist as a command line tool for initializing, serving, and deploying projects.
    2. It should exist as a NPM package that acts as a server. This will build HTTP responses based upon project code and Neo4j data.
3. Easy to setup. It should be easy to initialize a new project and get started on project code right away.
4. Use the latest features of the web platform. It should be built with PWA, Service Worker, Web Components, and HTTP/2 in mind.
5. It should have various deployment options including a live server and a static site generator.

## Getting Started

1. Clone this repo
2. Run `npm install`
4. Install neo4j and have it run on the default port of 7474
3. Install seed data: `npm run seed`
3. Run `npm run author` or `npm run start`
    * Author provides content editing capabilities. The start command runs in a non editable mode.
5. Visit http://localhost:3000

## Development

### Project Organization and Concepts

* elements
    * Interactive web components.
* components
    * Static server side rendered pieces of reusable dom where elements can be included. Corresponds to tactype="component" objects in the json content.
* pages
    * Static server side rendered pages where components and elements can be included. Corresponds to tactype="page" objects in the json content.
* global
    * Global css and js to apply on every page.
* tactile
    * This is the tactile code which renders web pages and accesses the database. The goal is eventually to move this into a separate NPM package.

## Production

### Deployment

Push a git commit to the master branch. This will force a new deployment.

### Production Neo4j Access

https://hobby-likjgfonlgkmgbkekaflkkal.dbs.graphenedb.com:24780/browser/
Requires an authenticated Heroku account.
