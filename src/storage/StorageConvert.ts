import lodash from "lodash";

import { Entry, StringMap } from "../state/StringMap";
import { UserState } from "../state/user/UserState";

export function importUserData(rawUserData: UserState): UserState {
	// Convert array of entries to index object
	if (!rawUserData.hasOwnProperty("globalsettings")) {
		console.log("new format");

		return rawUserData;
	}

	// tslint:disable-next-line:no-any
	const raw = rawUserData as any;

	raw.notes = lodash.mapValues(raw.notes, (note) => {
		if (note.hasOwnProperty("children")) {
			// do nothing
		} else if (note.hasOwnProperty("childNotes")) {
			note = {
				...note,
				children: note.childNotes,
			};
			note = lodash.omit(note, ["childNotes"]);
		} else {
			note = {
				...note,
				children: [],
			};
		}

		if (!note.hasOwnProperty("links")) {
			note = {
				...note,
				links: [],
			};
		}
		if (!note.hasOwnProperty("tags")) {
			note = {
				...note,
				tags: [],
			};
		}

		return note;
	});

	const roots = (raw.hasOwnProperty("roots"))
		? raw.roots
		: raw.rootNotes;

	const fuckupNotes: string[] = [];
	for (const note of Object.values(raw.notes)) {
		if (note.parent !== undefined) {
			const parent = raw.notes[note.parent];
			if (parent.children.indexOf(note.id) === -1) {
				console.log("could not find", note);
				console.log("insode of", parent);
				fuckupNotes.push(note.id);
				note.parent = "fuckupRoot";
			}
		}
	}
	if (fuckupNotes.length > 0) {
		raw.notes = {
			...raw.notes,
			fuckupRoot: {
				id: "fuckupRoot",
				text: "Fuckup Elements",
				children: fuckupNotes,
				tags: [],
				links: [],
			},
		};
		raw.roots.push("fuckupRoot");
	}

	const newFormat = {
		name: raw.globalsettings.name,
		prod: false,
		tags: {
			roots: [],
			entries: {},
		},
		editors: {},
		views: {
			view1: {
				id: "view1",
				forBookId: "firstbook",
			},
		},
		books: {
			firstbook: {
				id: "firstbook",
				items: {
					roots,
					entries: raw.notes,
				},
			},
		},
	};
	console.log("converted to", newFormat);

	return newFormat;

	// return {
	// 	...rawUserData,
	// 	books: entryArrayToIndex(rawUserData.books, (book) => {
	// 		book.items = {
	// 			...book.items,
	// 			entries: entryArrayToIndex(book.items.entries),
	// 		};

	// 		return book;
	// 	}),
	// 	views: entryArrayToIndex(rawUserData.views),
	// };
}

function entryArrayToIndex<T extends Entry>(rawEntries: StringMap<T>, callback?: (entry: T) => T): StringMap<T> {
	const entries = rawEntries as {} as T[];

	const result: StringMap<T> = {};
	for (let entry of entries) {
		if (callback !== undefined) {
			entry = callback(entry);
		}
		result[entry.id] = entry;
	}

	return result;
}
