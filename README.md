# treenotebook - Note taking with nested lists and tags

TreeNoteBook is a note taking app using powerful nested lists and can be easily self-hosted. Nested lists are a great notes system that are finally usable at scale. TreeNoteBook is aiming to be an open source alternative to apps like Workflowy and a cross-platform alternative to desktop apps like TreeNote.

* Infinite depth nested lists
* Nestable tags like #cooking, #cooking/tips, #cooking/recipe/breakfast
* Link handling
* Self-hosting eliminates long-term dependence on 3rd party services (cost, increased cost, limits, abandonment)
* Web app gives cross-platform support today without needing to install an app
* JS client reduces server-side backend complexity

Planned

* Search
* Tag Filtering
* Smart items that can contain a search itself
* Markdown parsing
* Multiple views
* Subviews with breadcrumbs
* Hard linked trees
* Multiple books
* Encrypted lists

Future

* Collaborative editing
  * Syncing 2 clients after going offline
* Uploaded files
* Image preview
* Iterative backups
* Automatic and manual export to other formats like XML, Markdown, etc
* Theme

Long term goals

* Rewrite PHP backend with something like Rust for easy single executable deployment
* Dropbox integration for users who don't want to host the server
* Use React-Native for a more friendly, native experience on mobile
* WebExtension for one-click add

# Building

You demo a version here https://thelq.github.io/treenotebook/

To build yourself

* `npm install`
* `npm run gulpc bundle`
* Copy dist, including the symlinked src-php subdirectory although only json.php is needed, to your webserver
* Visit on your PHP-enabled webserver

# Development

## Library soup

* TypeScript for sanity
  *  typescript-string-enum
* Build - `npm run bundle`
    * Starts rollup
        * es6 module bundler
        * makes a single bundle.js
        * configured by build-scripts/rollup.config.js
    * rollup-plugin-node-resolve finds modules in other projects
    * rollup-plugin-commonjs converts commonjs modules to es2015 for rollup
    * rollup-plugin-typescript compiles .ts with built in typescript adapter
    * Rollup optimizes
    * Rollup writes output to dist/bundle.js
* Test using karma (planned)
    * Starts karma
        * test server like surefire?
        * configured by build-scripts karma.config.js
    * preprocess with rollup
    * mocha is the testng-like test runner
    * chai-js is the seperate assertion library
    * sinon-js is the mocking library
    * karma-mocha-reporter is the test output

## Rewrite history

1. OneNote, text files, random documents, and physical sticky notes and notebooks
1. Sphinx/rst
1. Knockout.JS
1. Pure PHP
1. React
1. React + Redux

## Name ideas not already taken

* treenotebook
* selfnotes
* selfnotetree
* selftreenotes