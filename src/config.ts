import jQuery from "jquery";

import * as ItemReact from "./ui/item";

export class Root {
	static fromJson(rawJson: any): Root {
		const newRoot = new Root();
		newRoot.globalsettings = rawJson.globalsettings;
		newRoot.roots = rawJson.roots;
		newRoot.notes = new Map();

		for (const key in rawJson.notes) {
			if (rawJson.notes.hasOwnProperty(key)) {
				const value = Item.fromJson(rawJson.notes[key]);
				newRoot.notes.set(key, value);
			}
		}

		return newRoot;
	}

	public globalsettings: GlobalSettings;
	public notes: Map<string, Item>;
	public roots: string[];

	toJson(): any {
		// rebuild map as json-able key-value object
		const jsonNotes = {} as any;
		for (const value of this.notes.values()) {
			jsonNotes[value.id] = value.toJson();
		}

		return Object.assign({}, this, {
			notes: jsonNotes,
		});
	}
}

export class GlobalSettings {
	public name: string;
}

export class Item {
	static fromJson(rawJsonItem: any) {
		const newItem = new Item();
		Object.assign(newItem, rawJsonItem);

		newItem.links = new Set(rawJsonItem.links);
		newItem.tags = new Set(rawJsonItem.tags);

		return newItem;
	}

	public id: string;
	public parent: string;
	public children: string[];
	public text: string;
	public tags: Set<string> = new Set<string>();
	public settings: ItemSettings = [];
	public links: Set<string> = new Set<string>();

	toJson() {
		return Object.assign({}, this, {
			tags: [...this.tags],
			links: [...this.links],
		});
	}
}

export class ItemSettings {
}

let activeConfig: Root;

export function getItem(id: string): Item {
	if (id == null) {
		throw new Error("id is " + id);
	}
	const item = activeConfig.notes.get(id);
	if (item == null) {
		// console.log("id is", id);
		// activeConfig.notes.forEach((key, value) => {
		// 	console.log("key ", key);
		// });
		throw new Error("Missing item " + id + " out of " + activeConfig.notes.size);
	}
	return item;
}

export function getAllTags(): string[] {
	const tags: string[] = [];
	activeConfig.notes.forEach((curItem) => {
		if (curItem.tags == null) {
			return;
		}
		curItem.tags.forEach((curTag) => {
			if (tags.indexOf(curTag) === -1) {
				tags.push(curTag);
			}
		});
	});
	return tags;
}

export function initActiveConfig(callback: () => any) {
	jQuery.ajax({
		url: "../src-php/json.php",
		dataType: "json",
	}).done((data) => {
		console.log("fetched data", data);
		activeConfig = Root.fromJson(data);
		console.log("built config", activeConfig);

		callback();
	});
}

export function saveActiveConfig() {
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
