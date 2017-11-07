import lodash from "lodash";
import { AnyAction } from "redux";
import uuid from "uuid";

import { ClientViewMap } from "../../../state/client/ClientState";
import { getActiveItem, getParent } from "../../../state/tools";
import { UserState } from "../../../state/user/UserState";
import { deepSlowMerge } from "../../../utils";
import { ActionType } from "../actions/ActionType";
import { EditorInsertBelowAction } from "../actions/EditorActions";

export function InsertReducer(
	state: UserState,
	viewMap: ClientViewMap,
	rawAction: AnyAction,
): UserState {
	switch (rawAction.type) {
		case ActionType.EDITOR_INSERT_BELOW: {
			const action = rawAction as EditorInsertBelowAction;

			const activeItem = getActiveItem(viewMap, action.viewId);
			const activeParent = getParent(state.books[activeItem.bookId].items, activeItem);

			const newId = uuid.v4();

			let bookRoots = state.books[activeItem.bookId].items.roots;
			let bookItems;
			if (activeParent.parent === undefined) {
				bookItems = {};
				bookRoots = lodash.concat(bookRoots, [newId]);
			} else {
				bookItems = {
					[activeParent.parent.id]: {
						children: lodash.concat(activeParent.parent.children, [newId]),
					},
				};
			}
			bookItems = {
				...bookItems,
				[newId]: {
					id: newId,
					parent: activeParent.parentId,
					children: [],
					name: "",
					text: "placeholder",
					tags: [],
					links: [],
				},
			};

			return deepSlowMerge(state, {
				editors: {
					[newId]: {
						id: newId,
						parent: activeParent.parentId,
						bookId: activeItem.bookId,
						text: "placeholder",
						textRaw: "placeholder",
						tags: [],
						links: [],
						deleteOnCancel: true,
					},
				},
				books: {
					[activeItem.bookId]: {
						items: {
							roots: bookRoots,
							entries: bookItems,
						},
					},
				},
			});
		}
		default:
			return state;
	}
}