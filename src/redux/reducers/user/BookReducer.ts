import lodash from "lodash";
import { AnyAction } from "redux";

import { StringMap } from "../../../state/StringMap";
import { fillItemDefault, ItemState } from "../../../state/user/ItemState";
import { BookMap } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";

export function BookReducer(
	state: BookMap,
	rawAction: AnyAction,
): BookMap {
	switch (rawAction.type) {
		case ActionType.INIT:
			return lodash.mapValues(state, (book) => {
				const newItems: StringMap<ItemState> = {};
				for (const itemId of Object.keys(book.items.entries)) {
					// copy id from map key to item for easy reference
					const newNote = {
						...book.items.entries[itemId],
						id: itemId,
					};
					fillItemDefault(newNote, book.items.roots);
					newItems[itemId] = newNote;
				}

				return {
					...book,
					items: {
						...book.items,
						entries: newItems,
					},
				};
			});
		default:
			return state;
	}
}
