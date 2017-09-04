import { BookState } from "./user/BookState";
import { ItemState } from "./user/ItemState";
import { UserState } from "./user/UserState";

// ----- Item Data ------

export function getItem(book: BookState, id: string): ItemState {
	if (id == null) {
		throw new Error("id is " + id);
	}
	const item = book.items[id];
	if (item == null) {
		// console.log("id is", id);
		// activeConfig.notes.forEach((key, value) => {
		// 	console.log("key ", key);
		// });
		throw new Error("Missing item " + id + " out of " + Object.values(book.rootItems).length);
	}
	return item;
}

export function getParent(item: ItemState, book: BookState): ParentData {
	if (item.parent != null) {
		const parent = getItem(book, item.parent);
		const childIndex = parent.childNotes.indexOf(item.id);
		if (childIndex === -1) {
			console.log("parent", parent);
			console.log("item", item);
			throw new Error("could not find child " + item.id + " in parent " + parent.id);
		}
		return {
			parent,
			parentChildren: parent.childNotes,
			indexOfChild: childIndex,
		};
	} else {
		const childIndex = book.rootItems.indexOf(item.id);
		if (childIndex === -1) {
			throw new Error("could not find child " + item.id + " in roots");
		}
		return {
			parent: null,
			parentChildren: book.rootItems,
			indexOfChild: childIndex,
		};
	}
}

interface ParentData {
	parent: ItemState | null;
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

export function applyRecursive(item: ItemState, root: BookState, callback: (value: ItemState) => void) {
	callback(item);
	for (const child of item.childNotes) {
		applyRecursive(
			getItem(root, child),
			root,
			callback,
		);
	}
}

export function validate(userState: UserState) {
	for(const book of Object.values(userState.books)) {
		validateBook(book);
	}
}

function validateBook(book: BookState) {
	for (const item of Object.values(book.items)) {
		try {
			if (!(item.id in book.items)) {
				throw new Error("Failed to find id " + item.id);
			} else if (item.childNotes == null) {
				throw new Error("childNotes is null for " + item.id);
			} else if (item.tags == null) {
				throw new Error("tags is null for " + item.id);
			} else if (item.settings == null) {
				throw new Error("settings is null for " + item.id);
			} else if (item.links == null) {
				throw new Error("links is null for " + item.id);
			} else if (item.text == null) {
				throw new Error("text is null for " + item.id);
			}

			if (item.parent == null) {
				if (book.rootItems.indexOf(item.id) === -1) {
					throw new Error("Item " + item.id + " has no parent but not in roots");
				}
			} else {
				if (!(item.parent in book.items)) {
					throw new Error("Failed to find parent id " + item.parent);
				}
				const parent = book.items[item.parent];
				if (parent.childNotes == null) {
					throw new Error("Parent id " + parent.id + " has no children");
				} else if (parent.childNotes.indexOf(item.id) === -1) {
					throw new Error("Parent id " + parent.id + " does not contain it's child id " + item.id);
				}
			}
		} catch (error) {
			console.log("item", item);
			throw error;
		}
	}
}
