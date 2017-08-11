import { SettingsModel } from "./settings";

// Entries that can be shared between ItemModel and React-Redux Item
// Edits must be synced with React-Redux Item
export interface AbstractItemModel {
	readonly id: string;
	parent: string;
	childNotes: string[];
	text: string;
	settings: SettingsModel;
	links: string[];

	// ui state
	selected: boolean;
	even: boolean;
}

export interface ItemModel extends AbstractItemModel {
	// not synced, item will normalise
	tags: string[];
}
