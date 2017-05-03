treenotebook - Note taking with nested lists and tags

Development
-----------

Library soup

* Build - `npm run build` (defined in package.json)
    * Starts rollup
        * es6 module bundler
        * makes a single bundle.js
        * configured by build-scripts/rollup.config.js
    * rollup-plugin-node-resolve finds modules in other projects
    * rollup-plugin-commonjs converts commonjs modules to es2015 for rollup
    * rollup-plugin-typescript compiles .ts with built in typescript adapter
    * Rollup optimizes
    * Rollup writes output to dist/bundle.js
* Test using karma
    * Starts karma
        * test server like surefire?
        * configured by build-scripts karma.config.js
    * preprocess with rollup
    * mocha is the testng-like test runner
    * chai-js is the seperate assertion library
    * sinon-js is the mocking library
    * karma-mocha-reporter is the test output