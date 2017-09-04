import { AnyAction } from "redux";

import { BookState, ItemMap } from "../../../state/user/BookState";
import { fillItemDefault } from "../../../state/user/ItemState";

import ActionType from "../ActionType";

export default BookReducer;
function BookReducer(
	state: BookState,
	rawAction: AnyAction,
): BookState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			const newItems: ItemMap = {};
			for (const itemId in state.items) {
				if (!state.items.hasOwnProperty(itemId)) {
					continue;
				}
				// id readonly workaround
				const newNote = {
					...state.items[itemId],
					id: itemId,
				};
				fillItemDefault(newNote, state.rootItems);

				newItems[itemId] = newNote;
			}
			return {
				...state,
				items: newItems,
			};
		}
		default:
			return state;
	}
}
