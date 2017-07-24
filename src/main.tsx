"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";
import * as Error from "./ui/error";
import * as EventHandler from "./ui/eventHandlers";
import {ItemComponent as ItemComponent} from "./ui/item";

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
	const rootItems = ItemComponent.renderList(Config.getActiveConfig().roots, true);
	return (
		<div>
			<Error.ErrorComponent ref={Error.setComponent} />
			{rootItems}
		</div>
	);
}

console.log("main end");
