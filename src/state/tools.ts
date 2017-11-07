import lodash from "lodash";

import { ClientViewMap } from "./client/ClientState";
import { ClientItemState, ClientViewState } from "./client/ClientViewState";
import { Entry, StringMap } from "./StringMap";
import { BookState, UserItemMap } from "./user/BookState";
import { ItemState } from "./user/ItemState";

// ----- Item Data ------

export function getItem(items: UserItemMap, id: string): ItemState {
	if (id === undefined) {
		throw new Error(`id is ${id}`);
	}
	const item = items.entries[id];
	if (item === undefined) {
		// console.log("id is", id);
		// activeConfig.notes.forEach((key, value) => {
		// 	console.log("key ", key);
		// });
		throw new Error(`Missing item ${id} out of ${items.entries.length}`);
	}

	return item;
}

export function getParent(items: UserItemMap, item: ItemState): ParentData {
	if (item.parent !== undefined) {
		const parent = getItem(items, item.parent);
		const childIndex = parent.children.indexOf(item.id);
		if (childIndex === -1) {
			console.log("parent", parent);
			console.log("item", item);
			throw new Error(`could not find child ${item.id} in parent ${parent.id}`);
		}

		return {
			parent,
			parentId: item.parent,
			parentChildren: parent.children,
			indexOfChild: childIndex,
		};
	} else {
		const childIndex = items.roots.indexOf(item.id);
		if (childIndex === -1) {
			throw new Error(`could not find child ${item.id} in roots`);
		}

		return {
			parent: undefined,
			parentId: undefined,
			parentChildren: items.roots,
			indexOfChild: childIndex,
		};
	}
}

interface ParentData {
	parent: ItemState | undefined;
	parentId: string | undefined;
	parentChildren: string[];
	indexOfChild: number;
}

export function getAllTags(userData: BookState): string[] {
	const tags: string[] = [];
	for (const item of Object.values(userData.items.entries)) {
		for (const tag of item.tags) {
			if (tags.indexOf(tag) === -1) {
				tags.push(tag);
			}
		}
	}

	return tags;
}

// ------ Utils ----

export function applyRecursive(items: UserItemMap, item: ItemState, callback: (value: ItemState) => void) {
	callback(item);
	for (const child of item.children) {
		applyRecursive(
			items,
			getItem(items, child),
			callback,
		);
	}
}

export function getActiveView(views: ClientViewMap, viewId?: string): ClientViewState {
	let lookupViewId = viewId;
	if (lookupViewId === undefined) {
		lookupViewId = views.active;
		if (lookupViewId === undefined) {
			throw new Error("no view active");
		}
	}

	const value = views.entries[lookupViewId];
	if (value === undefined) {
		console.log("views", views);
		throw new Error(`cannot find view '${lookupViewId}'`);
	}

	return value;
}

export function getActiveItem(views: ClientViewMap, viewId?: string): ClientItemState {
	const view = getActiveView(views, viewId);

	const active = view.items.active;
	if (active === undefined) {
		throw new Error("no item active");
	}

	const value = view.items.entries[active];
	if (value === undefined) {
		console.log("views", views);
		throw new Error(`cannot find item '${active}'`);
	}

	return value;
}

// export function hasActive(value: string | undefined, name: string): value is string {
// 	if (value === undefined) {
// 		throw new Error(`active is missing for ${name}`);
// 	}

// 	return true;
// }

export function transformStringMap<T extends Entry>(
	entries: StringMap<T>,
	viewId: string,
	callback: (view: T) => T,
): StringMap<T> {
	return lodash.mapValues(entries, (entry) => {
		if (viewId === entry.id) {
			return callback(entry);
		}

		return entry;
	});
}

/**
 * Copy object and apply onSingle transform to one key
 * @param map
 * @param key
 * @param onSingle
 */
export function mapSingle<V extends Entry>(
	map: StringMap<V>,
	key: string,
	onSingle: (val: V) => V,
) {
	const newMap = {...map};
	newMap[key] = onSingle(newMap[key]);

	return newMap;
}

export function getFirstInMap<T extends Entry>(map: StringMap<T>): T | undefined {
	for (const key in map) {
		if (!map.hasOwnProperty(key)) {
			continue;
		}

		return map[key];
	}

	return undefined;
}

export function getFirstInMapOrError<T extends Entry>(map: StringMap<T>): T {
	const result = getFirstInMap(map);
	if (result === undefined) {
		throw new Error("map empty");
	}

	return result;
}

