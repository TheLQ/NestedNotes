/* tslint:disable:no-implicit-dependencies */
import * as gulp from "gulp";
import * as gulpStd from "gulp-standard-tasks";
import tslint from "gulp-tslint";
import * as rollup from "rollup";
import * as commonjs from "rollup-plugin-commonjs";
import * as nodeResolve from "rollup-plugin-node-resolve";
import * as replace from "rollup-plugin-replace";
import * as rollupTypescript from "rollup-plugin-typescript2";
import typescript from "typescript";

/* To run: npm run gulp -- build
 */

const tasks = gulpStd(gulp);

const SOURCE_ALL_FILES = "./src/**/*";
const TEST_ALL_FILES = "./test/**/*";

function doLint(paths: string[]) {
	return gulp.src(paths)
		.pipe(tslint({
			configuration: "tslint.json",
			formatter: "verbose",
		}))
		.pipe(tslint.report({
			emitError: false,
		}));
}
gulp.task("lintGulp", () => doLint(["gulpfile.ts"]));
gulp.task("lint", ["lintGulp"], () => doLint(["./src/**/*.ts", "./src/**/*.tsx"]));
gulp.task("testLint", ["testCompile"], () => doLint([TEST_ALL_FILES]));

gulp.task("cleanBundle", tasks.clean("./dist/bundle.js*"));

gulp.task("bundle", ["lint"], async () => {
	const bundle = await rollup.rollup({
		entry: "./src/main.tsx",
		plugins: [
			nodeResolve({
				module: true,
				jsnext: true,
				browser: true,
				extensions: [".js", ".json", ".ts", ".tsx"],
				preferBuiltins: false,
			}),
			commonjs({
				include: "node_modules/**",
				sourceMap: true,
				namedExports: {
					"node_modules/react/react.js": [ "Children", "Component", "createElement" ],
				},
			}),
			rollupTypescript({
				typescript,
				abortOnError: false,
				// verbosity: 3,
				// check: false,
			}),
			// needed for react and react-dom
			replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
		],
	});

	await bundle.write({
		format: "iife",
		moduleName: "selfnotes",
		dest: "./dist/bundle.js",
		sourceMap: true,
	});
});

gulp.task("build", ["compile", "testCompile", "bundle"], () => {
	// TODO: gulp4 code
	// gulp.series(
	//   "clean",
	//   gulp.parallel("compile", "testCompile"),
	//   "bundle"
	// )
});
