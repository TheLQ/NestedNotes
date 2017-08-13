import { SettingsState } from "./SettingsState";
export interface ItemState {
	readonly id: string;
	parent: string;
	childNotes: string[];
	text: string;
	settings: SettingsState;
	links: string[];
	tags: string[];
}

export function fillItemDefault(item: ItemState, roots: string[]) {
	if (typeof item.id === "undefined") {
		console.log("Invalid item: Missing id. ", item);
		throw new Error("Invalid item: Missing id. " + item.id);
	}
	if (typeof item.parent === "undefined") {
		if (roots.indexOf(item.id) === -1) {
			console.log("Invalid item: Missing parent. ", item);
			throw new Error("Invalid item: Missing parent. " + item.id);
		}
	} else {
		if (roots.indexOf(item.id) !== -1) {
			console.log("Invalid item: Illegal state, has parent and in rootNotes. ", item);
			throw new Error("Invalid item: Illegal state, has parent and in rootNotes. " + item.id);
		}
	}

	if (typeof item.childNotes === "undefined") {
		item.childNotes = [];
	}
	if (typeof item.text === "undefined") {
		console.log("Invalid item: Missing text. ", item);
		throw new Error("Invalid item: Missing text. " + item);
	}
	if (typeof item.settings === "undefined") {
		item.settings = {};
	}
	if (typeof item.links === "undefined") {
		item.links = [];
	}
	if (typeof item.tags === "undefined") {
		item.tags = [];
	}
}
