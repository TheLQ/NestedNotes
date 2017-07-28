"use strict";

import React from "react";
import ReactDOM from "react-dom";


import * as Error from "./ui/error";
import * as EventHandler from "./ui/eventHandlers";
import {ItemComponent as ItemComponent} from "./ui/item";
import * as ActiveRoot from "./model/active";

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
	const rootItems = ItemComponent.renderList(ActiveRoot.getActiveConfig().children, true);
	return (
		<div>
			<Error.ErrorComponent ref={Error.setComponent} />
			{rootItems}
		</div>
	);
}

console.log("main end");
