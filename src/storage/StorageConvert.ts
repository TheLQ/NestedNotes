import { Entry } from "../state/Entry";
import { StringMap } from "../state/StringMap";
import { UserState } from "../state/user/UserState";

export function importUserData(rawUserData: UserState): UserState {
	// Convert array of entries to index object
	return {
		...rawUserData,
		books: entryArrayToIndex(rawUserData.books, (book) => {
			book.items = {
				...book.items,
				entries: entryArrayToIndex(book.items.entries),
			};

			return book;
		}),
		views: entryArrayToIndex(rawUserData.views),
	};
}

function entryArrayToIndex<T extends Entry>(rawEntries: StringMap<T>, callback?: (entry: T) => T): StringMap<T> {
	console.log("entries", rawEntries);
	const entries = rawEntries as any as T[];

	const result: StringMap<T> = {};
	for (let entry of entries) {
		if (callback !== undefined) {
			entry = callback(entry);
		}
		console.log(`mapping to ${entry.id}`);
		result[entry.id] = entry;
	}

	return result;
}
