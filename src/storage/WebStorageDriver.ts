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
			url: this.urlSave,
			dataType: "json",
		}).done((data) => {
			callback(data);
		}).fail(onAjaxFail);
	}

	public save(userState: UserState, callback: () => void): void {
		jQuery.post({
			url: this.urlLoad,
			// dataType: "json",
			data: userState,
		}).done((data) => {
			callback();
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
