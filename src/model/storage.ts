import jQuery from "jquery";

import * as ModelTools from "./tools";
import { UserDataModel } from "./userData";

import * as Utils from "../utils";

export function initActiveConfig(callback: (data: UserDataModel) => any) {
	jQuery.ajax({
		url: "../src-php/json.php",
		dataType: "json",
	}).done((data) => {
		console.log("fetched data", data);
		// activeConfig = UserRootModel.fromJson(data);
		console.log("built config", data);

		callback(data);
	}).fail(onAjaxFail);
}

export function saveActiveConfig(userData: UserDataModel) {
	ModelTools.validate(userData);
	console.log("sending data", userData);
	jQuery.post({
		url: "../src-php/json.php?mode=save",
		// dataType: "json",
		data: userData,
	}).done((data) => {
		console.log("sent data, response: ", data);
		// activeConfig = data;

		// callback();
	}).fail(onAjaxFail);
}

function onAjaxFail(jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown: string) {
	console.log("jqH", jqXHR);
	console.log("textStatus", textStatus);
	console.log("errorThrow", errorThrown);

	Utils.setError(
		"Storage Error: " + textStatus + " " + errorThrown
		+ "\nRaw Response from server:\n" + jqXHR.responseText,
	);
}
