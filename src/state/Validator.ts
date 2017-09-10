import { isNullOrUndefined } from "../utils";
import { ClientState } from "./client/ClientState";
import { Entry } from "./Entry";
import { RootState } from "./RootState";
import { ActiveStringMap } from "./StringMap";
import { ActiveTree } from "./Tree";
import { ItemMap } from "./user/BookState";
import { ItemState } from "./user/ItemState";
import { UserState } from "./user/UserState";

export function validate(root: RootState) {
	validateUser(root.user);
	validateClient(root.client);
}

function validateUser(userState: UserState) {
	for (const [key, book] of Object.entries(userState.books)) {
		validateEntry(key, book);
		validateItems(book.items);
	}
}

function validateClient(clientState: ClientState) {
	validateActive(clientState.views, true);
	for (const [key, view] of Object.entries(clientState.views.entries)) {
		validateEntry(key, view);
		validateItems(view.items);
	}
}

function validateItems(items: ItemMap) {
	for (const [key, item] of Object.entries(items.entries)) {
		validateEntry(key, item);
		validateItem(items, item);
	}
}

function validateItem(items: ItemMap, item: ItemState) {
	try {
		if (!(item.id in items.entries)) {
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
			if (!(item.parent in items.entries)) {
				throw new Error(`Failed to find parent id ${item.parent}`);
			}
			const parent = items.entries[item.parent];
			if (isNullOrUndefined(parent.childNotes)) {
				throw new Error(`Parent id ${parent.id} has no children`);
			} else if (parent.childNotes.indexOf(item.id) === -1) {
				throw new Error(`Parent id ${parent.id} does not contain its child id ${item.id}`);
			}
		} else {
			if (items.roots.indexOf(item.id) === -1) {
				throw new Error(`roots do not contain ${item.id}`);
			}
		}

		for (const childId of item.childNotes) {
			const child = items.entries[childId];
			if (child === undefined) {
				throw new Error(`child ${childId} of ${item.id} does not exist`);
			} else if (child.parent !== item.id) {
				throw new Error(`child ${childId} of ${item.id} has different parent ${child.parent}`);
			}
		}
	} catch (error) {
		console.log("item", item);
		throw error;
	}
}

function validateEntry(key: string, entry: Entry) {
	if (entry.id !== key) {
		throw new Error(`Entry with id ${entry.id} does match it's key ${key}`);
	}
}

function validateActive<T extends Entry>(
	map: ActiveStringMap<T> | ActiveTree<T>,
	skipOnUndefined: boolean,
) {
	if (map.active === undefined) {
		if (skipOnUndefined) {
			return;
		}
		throw new Error("active is undefined");
	}
	if (!(map.active in map.entries)) {
		throw new Error("cannot find active in entires");
	}
}
