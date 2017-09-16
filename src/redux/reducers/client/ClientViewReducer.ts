import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { ClientViewTags } from "../../../state/client/ClientViewState";
import { UserState } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";
import { SelectionReducer } from "../tools/SelectionReducer";

export function ClientViewReducer(
	state: ClientViewMap,
	userState: UserState,
	rawAction: AnyAction,
): ClientViewMap {
	state = SelectionReducer(state, rawAction);

	switch (rawAction.type) {
		case ActionType.INIT: {
			const result: ClientViewMap = {
				active: undefined,
				entries: {},
			};
			for (const [viewId, userView] of Object.entries(userState.views)) {
				if (result.active === undefined) {
					result.active = viewId;
				}

				const book = userState.books[userView.forBookId];

				const tags: ClientViewTags = {
					active: undefined,
					entries: {},
					roots: [],
				};
				for (const item of Object.values(book.items.entries)) {
					for (const tagName of item.tags) {
						if (!(tagName in tags)) {
							tags.entries[tagName] = {
								id: tagName,
								name: tagName,
							};
							tags.roots.push(tagName);
						}
					}
				}

				const newItems = lodash.mapValues(
					book.items.entries,
					(item) => ({
						...item,
						bookId: book.id,
					}),
				);

				result.entries[viewId] = {
					id: viewId,
					items: {
						entries: newItems,
						roots: book.items.roots,
						active: Object.keys(book.items.entries)[0],
					},
					tags,

				};
			}

			return result;
		}
		default:
			return state;
	}
}
