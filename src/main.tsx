"use strict";

import { ReduxManager } from "./redux/ReduxManager";
import { UserState } from "./state/user/UserState";
import { PhpStorageDriver } from "./storage/PhpStorageDriver";
import { WebStorageDriver } from "./storage/WebStorageDriver";
import * as Utils from "./utils";

// initialize
// import "./ui/edit";
// import "./ui/insert";
// import "./ui/move";
// import "./ui/selection";
// import "./redux/factory";

// window.addEventListener('error', (e) => {
//     // e instanceof ErrorEvent
//     console.error('caught the error: ', e);
// });

function globalErrorHandler(event: ErrorEvent) {
	// Note that col & error are new to the HTML 5 spec and may not be
	// supported in every browser.  It worked for me in Chrome.
	let extra = !event.colno ? "" : `\ncolumn: ${event.colno}`;
	extra += !event.error ? "" : `\nerror: ${event.error}`;

	// You can view the information in an alert to see things working like this:
	Utils.setError(`Error: ${event.message}\nfilename: ${event.filename}\nline: ${event.lineno} ${extra}`);

	// TODO: Report this error via ajax so you can keep track
	//       of what pages have JS issues
	const suppressErrorAlert = true;

	// If you return true, then error alerts (like in older versions of
	// Internet Explorer) will be suppressed.
	return suppressErrorAlert;
}

window.addEventListener("error", globalErrorHandler);

window.addEventListener("load", main);

export function main() {
	console.log("load EventListener");
	create(document.getElementById("react-content"));
}

export function create(element: HTMLElement | null) {
	if (element === null) {
		throw new Error("null element");
	}

	const debug = false;
	const storageDriver = (debug)
		? new WebStorageDriver(
			"default.json",
			// will fail
			"default.json",
		)
		: new PhpStorageDriver();
	const reduxManager = new ReduxManager(true, storageDriver);
	reduxManager.create(element);

	storageDriver.load((userState: UserState) => {
		if (userState.prod) {
			document.title = "ProdNotes";
		}

		start(userState, reduxManager);
	});
}

export function start(userState: UserState, reduxManager: ReduxManager) {
	console.log("raw state from driver", userState);
	reduxManager.onUserDataLoad(userState);

	const loading = document.getElementById("loading");
	if (loading !== null) {
		loading.outerHTML = "";
	}
}

console.log("main end");
