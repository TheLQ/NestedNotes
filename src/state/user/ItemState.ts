import { Entry } from "../Entry";
import { SettingsState } from "./SettingsState";

import { isNullOrUndefined } from "../../utils";

export interface ItemState extends Entry {
	parent?: string;
	childNotes: string[];
	text: string;
	settings: SettingsState;
	links: string[];
	tags: string[];
}

export function fillItemDefault(item: ItemState, rootItemIds: string[]) {
	if (item.id === "undefined") {
		console.log("Invalid item: Missing id. ", item);
		throw new Error(`Invalid item: Missing id. ${item.id}`);
	}
	if (isNullOrUndefined(item.parent)) {
		if (rootItemIds.indexOf(item.id) === -1) {
			console.log("Invalid item: Missing parent. ", item);
			throw new Error(`Invalid item: Missing parent. ${item.id}`);
		}
	} else {
		if (rootItemIds.indexOf(item.id) !== -1) {
			console.log("Invalid item: Illegal state, has parent and in rootNotes. ", item);
			throw new Error(`Invalid item: Illegal state, has parent and in rootNotes. ${item.id}`);
		}
	}

	if (isNullOrUndefined(item.childNotes)) {
		item.childNotes = [];
	}
	if (isNullOrUndefined(item.text)) {
		console.log("Invalid item: Missing text. ", item);
		throw new Error(`Invalid item: Missing text. ${item}`);
	}
	if (isNullOrUndefined(item.settings)) {
		item.settings = {};
	}
	if (isNullOrUndefined(item.links)) {
		item.links = [];
	}
	if (isNullOrUndefined(item.tags)) {
		item.tags = [];
	}
}
