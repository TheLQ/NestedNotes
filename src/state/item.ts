import { SettingsModel } from "./settings";
export interface ItemState {
	readonly id: string;
	parent: string;
	childNotes: string[];
	text: string;
	settings: SettingsModel;
	links: string[];
	tags: string[];
}

export function fillItemDefault(item: ItemState, roots: string[]) {
	if (typeof item.id === "undefined") {
		console.log("Invalid item: Missing id. ", item);
		throw new Error("Invalid item: Missing id. " + item);
	}
	if (typeof item.parent === "undefined" && roots.indexOf(item.id) === -1) {
		console.log("Invalid item: Missing parent. ", item);
		throw new Error("Invalid item: Missing parent. " + item);
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
