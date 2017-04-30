"use strict";

import * as commonjs from "rollup-plugin-commonjs";
import * as debug from "gulp-debug";
import * as es from "event-stream";
import * as fs from "fs";
import * as gulp from "gulp";
import * as gutil from "gulp-util";
import * as Karma from "karma";
import * as nodeResolve from "rollup-plugin-node-resolve";
import * as replace from "rollup-plugin-replace";
import * as rollup from "rollup-stream";
import * as source from "vinyl-source-stream";
import * as ts from "gulp-typescript";
import tslint from "gulp-tslint";

// import sass from "gulp-sass";
// import autoprefixer from "gulp-autoprefixer";
// import sourcemaps from "gulp-sourcemaps";

const SOURCE_ALL_FILES = "./src/**/*";
const TEST_ALL_FILES = "./test/**/*";

function convertTsToJs(source: string, dest: string) {
  const tsProject = ts.createProject("tsconfig.json");
  return gulp.src([source])
    .on("end", () => {
      gutil.log(
        "Converting typescript in " + source
        + " to js in " + dest,
      );
    })
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(dest));
}

gulp.task("compile", () => {
  return convertTsToJs(SOURCE_ALL_FILES, "./build/src");
});

gulp.task("testCompile", () => {
  return convertTsToJs(TEST_ALL_FILES, "./build/test");
});

gulp.task("lint", ["compile", "testCompile"], () => {
      gulp.src([SOURCE_ALL_FILES, TEST_ALL_FILES, "gulpfile.ts"])
        .pipe(tslint({
            formatter: "prose",
        }))
        .pipe(tslint.report({
            emitError: false,
        }));
});

gulp.task("build", ["compile", "testCompile"], () => {
  return rollup({
    entry: "build/src/main.js",
    sourceMap: true,
    format: "iife",
    plugins: [
      nodeResolve({
        module: true,
        jsnext: true,
        browser: true,
        //   extensions: [ ".js", ".json" ],
        preferBuiltins: false,
      }),
      commonjs({
        include: "node_modules/**",
        sourceMap: true,
      }),
      // needed for react and react-dom
      replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
    ],
  })
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("test", ["build"], () => {
  new Karma.Server({
    configFile: __dirname + "/etc/karma.config.js",
    singleRun: true,
  }).start();
});

// gulp.task("styles", () => {
//   return gulp.src(paths.src)
//     // .pipe(sourcemaps.init())
//     // .pipe(sass.sync().on("error", plugins.sass.logError))
//     // .pipe(autoprefixer())
//     // .pipe(sourcemaps.write("."))
//     .pipe(gulp.dest(paths.dest));
// });
