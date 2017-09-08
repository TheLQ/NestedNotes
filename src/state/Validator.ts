import { ItemState } from "./user/ItemState";
import { isNullOrUndefined } from "../utils";
import { RootState } from "./RootState";
import { BookState } from "./user/BookState";
import { UserState } from "./user/UserState";

export function validate(root: RootState) {
	validateUser(root.user);
}

function validateUser(userState: UserState) {
	for (const book of Object.values(userState.books)) {
		validateBook(book);
	}
}

function validateBook(book: BookState) {
	for (const item of Object.values(book.items.entries)) {
		validateItem(book, item);
	}
}

function validateItem(book: BookState, item: ItemState) {
	try {
		if (!(item.id in book.items.entries)) {
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
			if (!(item.parent in book.items.entries)) {
				throw new Error(`Failed to find parent id ${item.parent}`);
			}
			const parent = book.items.entries[item.parent];
			if (isNullOrUndefined(parent.childNotes)) {
				throw new Error(`Parent id ${parent.id} has no children`);
			} else if (parent.childNotes.indexOf(item.id) === -1) {
				throw new Error(`Parent id ${parent.id} does not contain it's child id ${item.id}`);
			}
		} else {
			if (book.items.roots.indexOf(item.id) === -1) {
				throw new Error(`roots do not contain ${item.id}`);
			}
		}

		for (const childId of item.childNotes) {
			const child = book.items.entries[childId];
			if (child === undefined) {
				throw new Error(`child ${childId} of ${item.id} does not exist`);
			} else if (child.parent !== item.id) {
				throw new Error(`child ${childId} of ${item.id} has different parent`);
			}
		}
	} catch (error) {
		console.log("item", item);
		throw error;
	}
}
