import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { ClientViewItems } from "../../../state/client/ClientViewState";

import { ActionType } from "../actions/ActionType";
import { MoveDownAction, MoveLeftAction, MoveRightAction, MoveUpAction } from "../actions/ViewActions";

import { transformStringMap } from "../../../utils";

export function MoveReducer(
	state: ClientViewMap,
	rawAction: AnyAction,
): ClientViewMap {
	switch (rawAction.type) {
		case ActionType.MOVE_UP: {
			const action = rawAction as MoveUpAction;

			return ifViewId(state, action.viewId, moveUp);
		}
		case ActionType.MOVE_DOWN: {
			const action = rawAction as MoveDownAction;

			return ifViewId(state, action.viewId, moveDown);
		}
		case ActionType.MOVE_LEFT: {
			const action = rawAction as MoveLeftAction;

			return ifViewId(state, action.viewId, moveLeft);
		}
		case ActionType.MOVE_RIGHT: {
			const action = rawAction as MoveRightAction;

			return ifViewId(state, action.viewId, moveRight);
		}
		default:
			return state;
	}
}

function ifViewId(
	state: ClientViewMap,
	viewIdRaw: string | undefined,
	callback: (view: ClientViewItems) => ClientViewItems,
): ClientViewMap {
	let viewId: string;
	if (viewIdRaw === undefined) {
		if (state.active === undefined) {
			throw new Error("active view is null");
		} else {
			viewId = state.active;
		}
	} else {
		viewId = viewIdRaw;
	}

	return {
		...state,
		entries: transformStringMap(state.entries, viewId, (view) => {
			if (view.id === viewId) {
				return {
					...view,
					items: callback(view.items),
				};
			} else {
				return view;
			}
		}),
	};
}

function moveUp(state: ClientViewItems): ClientViewItems {
	return moveUpDown(state, -1);
}

function moveDown(state: ClientViewItems): ClientViewItems {
	return moveUpDown(state, 1)
}

function moveUpDown(state: ClientViewItems, direction: number): ClientViewItems {
	if (state.active === undefined) {
		throw new Error("active item undefined");
	}
	const active = state.entries[state.active];

	const parentArray: string[] = active.parent === undefined
		? state.roots.splice(0)
		: state.entries[active.parent].childNotes.splice(0);

	const parentIndex = parentArray.indexOf(active.id);
	if (parentIndex === -1) {
		throw new Error(`child ${active.id} does not exist in parent ${parentArray}`);
	}
	parentArray.splice(parentIndex, 1);
	parentArray.splice(parentIndex + (1 * direction), 0, active.id);

	if (active.parent === undefined) {
		return {
			...state,
			roots: parentArray,
		};
	} else {
		return {
			...state,
			entries: lodash.mapValues(state.entries, (item) => {
				if (item.id === active.parent) {
					return {
						...item,
						childNotes: parentArray,
					};
				} else {
					return item;
				}
			}),
		};
	}
}


function moveLeft(state: ClientViewItems): ClientViewItems {
	/*
	const active = Selection.getActiveSelection();
	const parent = ActiveRoot.getActiveConfig().getItem(active.parent);
	const grandparent = ActiveRoot.getActiveConfig().getItem(parent.parent);

	ItemComponent.forItem(grandparent.id).setState((oldState: ItemState) => {
		const parentChildren = oldState.itemTree.children;
		if (parentChildren.indexOf(active.id) === 0) {
			// first in list, do nothing
			return;
		}

		Utils.deleteFrom(parentChildren, active.id);

		const parentIndexInGrandparent = Utils.indexOfOrError(grandparent.children, active.parent);
		oldState.itemTree.children.splice(parentIndexInGrandparent, 0, active.id);

		active.parent = grandparent.id;

		ActiveRoot.saveActiveConfig();
	});
	*/
}

function moveRight(state: ClientViewItems): ClientViewItems {
	/*
	const active = Selection.getActiveSelection();

	ItemComponent.forItem(active.parent).setState((oldState: ItemState) => {
		const parentChildren = oldState.itemTree.children;
		if (parentChildren.indexOf(active.id) === 0) {
			// first in list, do nothing
			return;
		}

		const oldActiveIndex = Utils.deleteFrom(parentChildren, active.id);

		const prevChild = ActiveRoot.getActiveConfig().getItem(parentChildren[oldActiveIndex - 1]);
		prevChild.children.push(active.id);

		active.parent = prevChild.id;

		ActiveRoot.saveActiveConfig();
	});
	*/
}