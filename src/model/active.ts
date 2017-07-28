import jQuery from "jquery";

import UserRootModel from "./userRoot";

let activeConfig: UserRootModel;

export function initActiveConfig(callback: () => any) {
	jQuery.ajax({
		url: "../src-php/json.php",
		dataType: "json",
	}).done((data) => {
		console.log("fetched data", data);
		activeConfig = UserRootModel.fromJson(data);
		console.log("built config", activeConfig);

		callback();
	});
}

export function saveActiveConfig() {
	activeConfig.validate();
	const json = activeConfig.toJson();
	console.log("sending data", json);
	jQuery.post({
		url: "../src-php/json.php?mode=save",
		// dataType: "json",
		data: json,
	}).done((data) => {
		console.log("sent data, response: ", data);
		// activeConfig = data;

		// callback();
	});
}

export function getActiveConfig() {
	return activeConfig;
}