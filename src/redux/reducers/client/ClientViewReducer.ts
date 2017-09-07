import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { ClientViewTags } from "../../../state/client/ClientViewState";
import { UserState } from "../../../state/user/UserState";

import ActionType from "../ActionType";
import { SelectionReducer } from "../tools/SelectionReducer";

function ClientViewReducer(
	state: ClientViewMap,
	userState: UserState,
	rawAction: AnyAction,
): ClientViewMap {
	state = SelectionReducer(state, rawAction);

	switch (rawAction.type) {
		case ActionType.INIT: {
			const result: ClientViewMap = {
				active: null,
				entries: {},
			};
			for (const [viewId, userView] of Object.entries(userState.views)) {
				if (result.active === null) {
					result.active = viewId;
				}

				const book = userState.books[userView.forBookId];

				const tags: ClientViewTags = {
					active: null,
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

				result.entries[viewId] = {
					viewId,
					items: {
						...book.items,
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
export default ClientViewReducer;
