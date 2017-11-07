import jQuery from "jquery";

import { UserState } from "../state/user/UserState";
import { setError } from "../utils";
import { StorageDriver } from "./StorageDriver";

export class WebStorageDriver implements StorageDriver {
	private urlLoad: string;
	private urlSave: string;

	public constructor(urlLoad: string, urlSave: string) {
		this.urlLoad = urlLoad;
		this.urlSave = urlSave;
	}

	public load = (callback: (userState: UserState) => void): void => {
		jQuery.ajax({
			url: this.urlLoad,
			dataType: "json",
		}).done((data) => {
			callback(data);
		}).fail(onAjaxFail);
	}

	public save(userState: UserState, callback?: () => void): void {
		console.log("save", new Error("fuck"));
		jQuery.post({
			url: this.urlSave,
			// dataType: "json",
			data: {
				json: JSON.stringify(userState),
			},
		}).done((data) => {
			if (data.length !== 0) {
				throw new Error("unexpected response from server of length :\n" + data);
			}
			if (callback !== undefined) {
				callback();
			}
		}).fail(onAjaxFail);
	}
}

function onAjaxFail(jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown: string) {
	console.log("jqH", jqXHR);
	console.log("textStatus", textStatus);
	console.log("errorThrow", errorThrown);

	setError(
		`Storage Error: ${textStatus} ${errorThrown}`
		+ `\nRaw Response from server:\n ${jqXHR.responseText}`,
	);
}
