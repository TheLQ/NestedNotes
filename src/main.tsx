"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";
import * as Error from "./ui/error";
import * as EventHandler from "./ui/eventHandlers";
import * as List from "./ui/list";

// initialize
import "./ui/edit";
import "./ui/selection";

// window.addEventListener('error', (e) => {
//     // e instanceof ErrorEvent
//     console.error('caught the error: ', e);
// });

window.addEventListener("load", main);

export function main() {
	console.log("load EventListener");
	// console.log('done2', rootComponent);

	Config.initActiveConfig(() => {
		ReactDOM.render(
			makeReactComponent(),
			document.getElementById("replaceMe"),
		);

		EventHandler.onPostReactInit(Config.getActiveConfig());

		const loading = document.getElementById("loading");
		if (loading != null) {
			loading.outerHTML = "";
		}
	});
}

export function makeReactComponent() {
	return (
		<div>
			<Error.Component ref={Error.setComponent} />
			<List.Component
				list={Config.getActiveConfig().notes}
				even={true}
			/>
		</div>
	);
}

console.log("main end");
