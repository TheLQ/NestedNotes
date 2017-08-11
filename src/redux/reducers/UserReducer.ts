import { fillItemDefault } from "../../state/item";
import { UserState, TagList } from "../../state/user";

import ActionType from "./ActionType";

function UserReducer(state: UserState, type: ActionType, value: any): UserState {
	switch (type) {
		case ActionType.INIT: {
			const raw = value as UserState;

			const newTags: TagList = {};
			for (const key in raw.notes) {
				if (!raw.notes.hasOwnProperty(key)) {
					continue;
				}
				// id readonly workaround
				const newNote = {
					...raw.notes[key],
					id: key,
				};
				fillItemDefault(newNote, raw.rootNotes);

				for (const tagName of newNote.tags) {
					if (!(tagName in newTags)) {
						newTags[tagName] = {
							id: tagName,
							name: tagName,
						};
					}
				}

				raw.notes[key] = newNote;
			}

			return {
				...raw,
				notes: raw.notes,
				tags: newTags,
			};
		}
		default:
			return state;
	}
}
export default UserReducer;
