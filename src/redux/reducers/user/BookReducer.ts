import { AnyAction } from "redux";

import { StringMap } from "../../../state/StringMap";
import { BookState } from "../../../state/user/BookState";
import { ItemState } from "../../../state/user/ItemState";

import { fillItemDefault } from "../../../state/user/ItemState";

import ActionType from "../ActionType";

export default BookReducer;
function BookReducer(
	state: BookState,
	rawAction: AnyAction,
): BookState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			const newItems: StringMap<ItemState> = {};
			for (const itemId of Object.keys(state.items.entries)) {
				// id readonly workaround
				const newNote = {
					...state.items.entries[itemId],
					id: itemId,
				};
				fillItemDefault(newNote, state.items.roots);

				newItems[itemId] = newNote;
			}
			return {
				...state,
				items: {
					roots: state.items.roots,
					entries: newItems,
				},
			};
		}
		default:
			return state;
	}
}
