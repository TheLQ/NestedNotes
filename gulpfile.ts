/* To run: npm run gulp -- build
 */

import * as es from "event-stream";
import * as fs from "fs";
import * as debug from "gulp-debug";

import * as gulp from "gulp";
import * as babel from "gulp-babel";
import tslint from "gulp-tslint";
import * as ts from "gulp-typescript";
import * as gutil from "gulp-util";
import * as rename from "gulp-rename";

import * as gulpStd from "gulp-standard-tasks";
const tasks = gulpStd(gulp);

import * as Karma from "karma";

import * as commonjs from "rollup-plugin-commonjs";
import * as nodeResolve from "rollup-plugin-node-resolve";
import * as replace from "rollup-plugin-replace";
import * as rollupTypescript from "rollup-plugin-typescript";
import * as rollupBabel from "rollup-plugin-babel";
// import * as rollup from "rollup-stream";
import * as rollup from "gulp-better-rollup";
import * as source from "vinyl-source-stream";
import * as buffer from "vinyl-buffer";

import * as pipe from 'multipipe';
import * as path from 'path';

// import sass from "gulp-sass";
// import autoprefixer from "gulp-autoprefixer";
import * as sourcemaps from "gulp-sourcemaps";

const SOURCE_ALL_FILES = "./src/**/*";
const TEST_ALL_FILES = "./test/**/*";

function newTsProject() {
  let proj = ts.createProject("tsconfig.json");
  return proj;
}

function convertTsToJs(source: string, dest: string): NodeJS.ReadWriteStream {
  const tsProject = newTsProject();
  return gulp.src([source])
    .pipe(tsProject())
    .on("end", () => {
      gutil.log(
        "Compiling typescript in " + source
        + " to js in " + dest,
      );
    })
    .js
    // .pipe(babel({
    //   presets: ['es2015']
    // }))
    .pipe(sourcemaps.write(".", {}))
    .pipe(gulp.dest(dest));
}

gulp.task("clean", tasks.clean("./build/src"));

gulp.task("testClean", tasks.clean("./build/test"));

function taskCompile() {
  return convertTsToJs(SOURCE_ALL_FILES, "./build/src");
}
gulp.task("compile", ["clean"], taskCompile);

function taskTestCompile() {
  return convertTsToJs(TEST_ALL_FILES, "./build/test");
}
gulp.task("testCompile", ["testClean"], taskTestCompile);

function doLint(paths: string[]) {
  return gulp.src(paths)
    .pipe(tslint({
      configuration: "tslint.json",
    }))
    .pipe(tslint.report({
      emitError: false,
    }));
}

gulp.task("lint", ["compile"], () => {
  return doLint([SOURCE_ALL_FILES, "gulpfile.ts"]);
});

gulp.task("testLint", ["testCompile"], () => {
  return doLint([TEST_ALL_FILES]);
});

gulp.task("cleanBundle", tasks.clean("./dist/bundle.js*"));

gulp.task("bundle", ["clean", "testClean", "cleanBundle"], () => {
  debugger;
  const tsProject = newTsProject();

  gulp.src('src/main.tsx')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rollup({
      // no entry needed, gulp-better-rollup automatically does this
      plugins: [
        nodeResolve({
          module: true,
          jsnext: true,
          // browser: true,
          extensions: [".js", ".json", ".ts", ".tsx"],
          // preferBuiltins: false,
        }),
        commonjs({
          include: "node_modules/**",
          sourceMap: true,
        }),
        rollupTypescript({
          typescript: require('typescript')
        }),
        // needed for react and react-dom
        replace({ "process.env.NODE_ENV": JSON.stringify("development") }),

      ],
    }, {
        // also rollups `sourceMap` option is replaced by gulp-sourcemaps plugin 
        format: "iife",
        moduleName: "selfnotes",
      }))
    .pipe(rename("bundle.js"))
    .pipe(sourcemaps.write(".", {}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("build", ["compile", "testCompile", "bundle"], () => {
  // TODO: gulp4 code
  // gulp.series(
  //   "clean",
  //   gulp.parallel("compile", "testCompile"),
  //   "bundle"
  // )
});

gulp.task("watch", ["bundle"], () => {
  return gulp.watch(
    [SOURCE_ALL_FILES, TEST_ALL_FILES],
    {
      debounceDelay: 5000/*ms*/
    },
    ["bundle"]
  );
});

gulp.task("test", [/*"bundle""lint", "testLint", "build"*/], () => {
  new Karma.Server({
    plugins: [
      // require("karma-es6-shim"),
      //
      require("karma-rollup-plugin"),
      require("karma-typescript"),
      require("karma-mocha"),
      require("karma-sinon"),
      require("karma-chai"),
      require("karma-phantomjs-launcher"),
      // require("karma-coverage"),
      require("karma-sourcemap-loader"),
      require("karma-chrome-launcher"),
      // require("karma-spec-reporter")
    ],

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ".",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["karma-typescript", "mocha", "chai", "sinon"],

    // list of files / patterns to load in the browser
    files: [
      "test/**/*.tsx",
      "test/**/*.ts",
      "src/**/*.ts",
      "src/**/*.tsx"
    ],

    // list of files to exclude
    exclude: [
    ],

    karmaTypescriptConfig: {
      compilerOptions: {
        module: "commonjs", 
        sourceMap: true
      },
      tsconfig: "./tsconfig.json",
    },

    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'sourcemap'],
      'src/**/*.tsx': ['karma-typescript', 'sourcemap'],
      'test/**/*.ts': ['karma-typescript', 'sourcemap'],
      'test/**/*.tsx': ['karma-typescript', 'sourcemap'],
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "karma-typescript"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: "config.LOG_DEBUG",

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"/*, "Firefox","PhantomJS"*/],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  } as Karma.ConfigOptions).start();
});

// gulp.task("styles", () => {
//   return gulp.src(paths.src)
//     // .pipe(sourcemaps.init())
//     // .pipe(sass.sync().on("error", plugins.sass.logError))
//     // .pipe(autoprefixer())
//     // .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest(paths.dest));
// });
