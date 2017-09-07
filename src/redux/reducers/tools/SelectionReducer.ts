import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { ClientViewState } from "../../../state/client/ClientViewState";
import * as StateTools from "../../../state/tools";
import { ItemState } from "../../../state/user/ItemState";

import { SelectItemAction, SelectNextAction, SelectPrevAction } from "../actions/ViewActions";
import { ActionType } from "../ActionType";

export function SelectionReducer(
	state: ClientViewMap,
	rawAction: AnyAction,
): ClientViewMap {
	switch (rawAction.type) {
		case ActionType.SELECT_ITEM: {
			const action = rawAction as SelectItemAction;

			return ifViewId(state, action.viewId, selectNext);
		}
		case ActionType.SELECT_ITEM_NEXT: {
			const action = rawAction as SelectNextAction;

			return ifViewId(state, action.viewId, selectNext);
		}
		case ActionType.SELECT_ITEM_NEXT_ACTIVE_VIEW: {
			if (state.active === undefined) {
				throw new Error("active view null");
			}

			return ifViewId(state, state.active, selectNext);
		}
		case ActionType.SELECT_ITEM_PREV: {
			const action = rawAction as SelectPrevAction;

			return ifViewId(state, action.viewId, selectPrev);
		}
		case ActionType.SELECT_ITEM_PREV_ACTIVE_VIEW: {
			if (state.active === undefined) {
				throw new Error("active view null");
			}

			return ifViewId(state, state.active, selectPrev);
		}
		default:
			return state;
	}
}

function ifViewId(
	state: ClientViewMap,
	viewId: string,
	callback: (view: ClientViewState) => string,
): ClientViewMap {
	return {
		...state,
		entries: lodash.mapValues(state.entries, (view) => {
			if (viewId === view.viewId) {
				return {
					...view,
					items: {
						...view.items,
						active: callback(view),
					},
				};
			}

			return view;
		}),
	};
}

function selectNext(view: ClientViewState): string {
	const selectedId = view.items.active;
	if (selectedId === undefined) {
		throw new Error("illegal state: null selection");
	}
	const selected = view.items.entries[selectedId];
	if (selected.childNotes.length > 0) {
		return selected.childNotes[0];
	} else {
		let child: ItemState = selected;
		while (true) {
			const parent = StateTools.getParent(view.items, child);
			if (parent.indexOfChild !== parent.parentChildren.length - 1) {
				return parent.parentChildren[parent.indexOfChild + 1];
			} else {
				if (parent.parent === undefined) {
					// At last entry
					return selectedId;
				}
				child = parent.parent;
				continue;
			}
		}
	}
}

function selectPrev(view: ClientViewState): string {
	const selectedId = view.items.active;
	if (selectedId === undefined) {
		throw new Error("illegal state: null selection");
	}
	const child = view.items.entries[selectedId];

	const parent = StateTools.getParent(view.items, child);
	if (parent.indexOfChild !== 0) {
		let prevSiblingId: string = parent.parentChildren[parent.indexOfChild - 1];
		let prevSibling: ItemState = view.items.entries[prevSiblingId];
		while (prevSibling.childNotes.length !== 0) {
			prevSiblingId = prevSibling.childNotes[prevSibling.childNotes.length - 1];
			prevSibling = view.items.entries[prevSiblingId];
		}

		return prevSiblingId;
	} else {
		if (parent.parent === undefined) {
			// at first entry
			return selectedId;
		}
		// child = parent.parent;

		return parent.parent.id;
		// break;
	}
}
