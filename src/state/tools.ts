import { BookState, ItemMap } from "./user/BookState";
import { ItemState } from "./user/ItemState";
import { UserState } from "./user/UserState";

import { isNullOrUndefined } from "../utils";

// ----- Item Data ------

export function getItem(items: ItemMap, id: string): ItemState {
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

export function getParent(items: ItemMap, item: ItemState): ParentData {
	if (item.parent !== undefined) {
		const parent = getItem(items, item.parent);
		const childIndex = parent.childNotes.indexOf(item.id);
		if (childIndex === -1) {
			console.log("parent", parent);
			console.log("item", item);
			throw new Error(`could not find child ${item.id} in parent ${parent.id}`);
		}

		return {
			parent,
			parentChildren: parent.childNotes,
			indexOfChild: childIndex,
		};
	} else {
		const childIndex = items.roots.indexOf(item.id);
		if (childIndex === -1) {
			throw new Error(`could not find child ${item.id} in roots`);
		}

		return {
			parent: undefined,
			parentChildren: items.roots,
			indexOfChild: childIndex,
		};
	}
}

interface ParentData {
	parent: ItemState | undefined;
	parentChildren: string[];
	indexOfChild: number;
}

export function getAllTags(userData: BookState): string[] {
	const tags: string[] = [];
	for (const item of Object.values(userData.items)) {
		for (const tag of item.tags) {
			if (tags.indexOf(tag) === -1) {
				tags.push(tag);
			}
		}
	}

	return tags;
}

// ------ Utils ----

export function applyRecursive(items: ItemMap, item: ItemState, callback: (value: ItemState) => void) {
	callback(item);
	for (const child of item.childNotes) {
		applyRecursive(
			items,
			getItem(items, child),
			callback,
		);
	}
}

export function validate(userState: UserState) {
	for (const book of Object.values(userState.books)) {
		validateBook(book);
	}
}

function validateBook(book: BookState) {
	for (const item of Object.values(book.items)) {
		try {
			if (!(item.id in book.items)) {
				throw new Error(`Failed to find id ${item.id}`);
			} else if (isNullOrUndefined(item.childNotes)) {
				throw new Error(`childNotes is null for ${item.id}`);
			} else if (isNullOrUndefined(item.tags)) {
				throw new Error(`tags is null for ${item.id}`);
			} else if (isNullOrUndefined(item.settings)) {
				throw new Error(`settings is null for ${item.id}`);
			} else if (isNullOrUndefined(item.links)) {
				throw new Error(`links is null for ${item.id}`);
			} else if (isNullOrUndefined(item.text)) {
				throw new Error(`text is null for ${item.id}`);
			}

			if (item.parent !== undefined) {
				if (!(item.parent in book.items)) {
					throw new Error(`Failed to find parent id ${item.parent}`);
				}
				const parent = book.items.entries[item.parent];
				if (isNullOrUndefined(parent.childNotes)) {
					throw new Error(`Parent id ${parent.id} has no children`);
				} else if (parent.childNotes.indexOf(item.id) === -1) {
					throw new Error(`Parent id ${parent.id} does not contain it's child id ${item.id}`);
				}
			}
		} catch (error) {
			console.log("item", item);
			throw error;
		}
	}
}
