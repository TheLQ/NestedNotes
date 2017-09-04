import { AnyAction } from "redux";
import shortid from "shortid";

import { ClientViewState } from "../../../state/client/ClientViewState";
import { TagMap } from "../../../state/user/BookState";
import { UserState } from "../../../state/user/UserState";
import { UserViewState } from "../../../state/user/UserViewState";

import ActionType from "../ActionType";

function ViewClientReducer(
	state: ClientViewState | null,
	viewUser: UserViewState,
	userState: UserState,
	rawAction: AnyAction,
): ClientViewState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			const book = userState.books[viewUser.forBookId];
			const newItems = book.items;

			const rootItemIds: string[] = [];
			const newTags: TagMap = {};
			for (const itemId in newItems) {
				if (!newItems.hasOwnProperty(itemId)) {
					continue;
				}
				const item = newItems[itemId];

				if (item.parent === undefined) {
					rootItemIds.push(item.id);
				}

				for (const tagName of item.tags) {
					if (!(tagName in newTags)) {
						newTags[tagName] = {
							id: tagName,
							name: tagName,
						};
					}
				}
			}

			return {
				viewId: viewUser.viewId,
				items: newItems,
				rootItems: rootItemIds,
				tags: newTags,
				selectedItem: rootItemIds[0],
				selectedTag: null,
			};
		}
		default:
			if (state == null) {
				throw new Error("null state");
			}
			return state;
	}
}
export default ViewClientReducer;
