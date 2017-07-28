"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as ActiveRoot from "./model/active";
import * as EventHandler from "./ui/eventHandlers";
import * as View from "./ui/view";

// initialize
import "./ui/edit";
import "./ui/insert";
import "./ui/selection";

// window.addEventListener('error', (e) => {
//     // e instanceof ErrorEvent
//     console.error('caught the error: ', e);
// });

window.addEventListener("load", main);

export function main() {
	console.log("load EventListener");

	ActiveRoot.initActiveConfig(() => {
		ReactDOM.render(
			makeReactComponent(),
			document.getElementById("replaceMe"),
		);

		EventHandler.onPostReactInit(ActiveRoot.getActiveConfig());

		const loading = document.getElementById("loading");
		if (loading != null) {
			loading.outerHTML = "";
		}
	});
}

export function makeReactComponent() {
	return <View.ViewComponent initRenderer={View.defaultRenderer}/>;
}

console.log("main end");
