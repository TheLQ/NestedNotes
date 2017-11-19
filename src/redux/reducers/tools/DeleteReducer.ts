import iassign from "immutable-assign";
import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { getActiveItem } from "../../../state/tools";
import { UserItemMap } from "../../../state/user/BookState";
import { BookMap } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";
import { DeleteItemAction } from "../actions/ViewActions";

export function DeleteReducer(
	state: BookMap,
	viewMap: ClientViewMap,
	rawAction: AnyAction,
): BookMap {
	switch (rawAction.type) {
		case ActionType.DELETE_ITEM:
			const action = rawAction as DeleteItemAction;
			const item = getActiveItem(viewMap, action.viewId);

			if (item.parent !== undefined) {
				state = iassign(
					state,
					(newState, ctx) => newState[ctx.bookId].items.entries[ctx.parentId].children,
					(newState) => lodash.without(newState, item.id),
					{
						bookId: item.bookId,
						parentId: item.parent,
					},
				);
			} else {
				state = iassign(
					state,
					(newState, ctx) => newState[ctx.bookId].items.roots,
					(newState) => lodash.without(newState, item.id),
					{
						bookId: item.bookId,
					},
				);
			}

			const childrenToDelete = descendants(state[item.bookId].items, item.id, [item.id]);

			return iassign(
				state,
				(newState, ctx) => newState[ctx.bookId].items.entries,
				(newState) => lodash.omit(newState, childrenToDelete),
				{ bookId: item.bookId },
			);
		default:
			return state;
	}
}

function descendants(state: UserItemMap, cursor: string, foundChildren: string[]): string[] {
	for (const childId of state.entries[cursor].children) {
		foundChildren.push(childId);
		foundChildren = descendants(state, childId, foundChildren);
	}

	return foundChildren;
}
