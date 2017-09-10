import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { ClientViewItems } from "../../../state/client/ClientViewState";
import { transformStringMap } from "../../../state/tools";
import { indexOfSafe } from "../../../utils";
import { ActionType } from "../actions/ActionType";
import { MoveDownAction, MoveLeftAction, MoveRightAction, MoveUpAction } from "../actions/ViewActions";

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
	return moveUpDown(state, 1);
}

function moveUpDown(state: ClientViewItems, direction: number): ClientViewItems {
	if (state.active === undefined) {
		throw new Error("active item undefined");
	}
	const active = state.entries[state.active];

	const parentArray: string[] = active.parent === undefined
		? state.roots.slice(0)
		: state.entries[active.parent].childNotes.slice(0);

	const parentIndex = indexOfSafe(
		parentArray,
		active.id,
		0,
		`child ${active.id} does not exist in parent ${parentArray}`,
	);
	if (direction === -1 && parentIndex === 0) {
		return state;
	} else if (direction === 1 && parentIndex === parentArray.length - 1) {
		return state;
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
	if (state.active === undefined) {
		throw new Error("active item undefined");
	}
	const active = state.entries[state.active];
	if (active.parent === undefined) {
		// is root item, can't go left anymore
		return state;
	}

	const parent = state.entries[active.parent];
	if (parent.parent === undefined) {
		// move child of root to sibling of root
		const rootIndex = state.roots.indexOf(parent.id);

		return moveTo(
			state,
			active.id,
			undefined,
			rootIndex + 1,
		);
	} else {
		// move child of parent to sibling of parent, or child of grandparent
		const grandParent = state.entries[parent.parent];
		const grandParentIndex = indexOfSafe(grandParent.childNotes, parent.id);

		return moveTo(
			state,
			active.id,
			grandParent.id,
			grandParentIndex + 1,
		);
	}
}

function moveRight(state: ClientViewItems): ClientViewItems {
	if (state.active === undefined) {
		throw new Error("active item undefined");
	}
	const active = state.entries[state.active];

	const parentChildren = (active.parent === undefined)
		? state.roots
		: state.entries[active.parent].childNotes;
	const parentIndex = indexOfSafe(parentChildren, active.id);
	if (parentIndex === 0) {
		return state;
	}

	return moveTo(
		state,
		active.id,
		parentChildren[parentIndex - 1],
		0,
	);
}

// ------ v1

// function moveTo(state: ClientViewItems, srcId: string, toId: string, after: boolean) {
// 	const srcEntry = state.entries[srcId];
// 	state = rewrite(state, srcEntry.parent, (children) => lodash.without(children, srcEntry.id));

// 	const toEntry = state.entries[toId];
// 	state = rewrite(
// 		state,
// 		toEntry.parent,
// 		(children) => {
// 			const toIndex = children.indexOf(toId);
// 			if (toIndex === -1) {
// 				throw new Error(`failed to find toId ${toId} in array ${children}`);
// 			}
// 			if (after) {
// 				return children.splice(toIndex + 1, 0, srcId);
// 			} else {
// 				return children.splice(toIndex, 0, srcId);
// 			}
// 		},
// 	);

// 	return state;
// }

// --------- v2

// function moveTo(state: ClientViewItems, srcId: string, toParentId: string, childPos: number) {
// 	const src = state.entries[srcId];
// 	state = rewriteItem(state, src.parent, (children) => lodash.without(children, src.id));

// 	// const toParent = state.entries[toParentId];
// 	state = rewriteItem(
// 		state,
// 		toParentId,
// 		(children) => {
// 			const newChildren = children.slice(0);
// 			newChildren.splice(childPos, 0, srcId);

// 			return newChildren;
// 		},
// 	);

// 	return state;
// }

// function rewriteItem(
// 	state: ClientViewItems,
// 	itemId: string | undefined,
// 	callback: (children: string[]) => string[],
// ): ClientViewItems {
// 	if (itemId === undefined) {
// 		return {
// 			...state,
// 			roots: callback(state.roots),
// 		};
// 	} else {
// 		return {
// 			...state,
// 			entries: lodash.mapValues(state.entries, (item) => {
// 				if (item.id === itemId) {
// 					return {
// 						...item,
// 						childNotes: callback(item.childNotes),
// 					};
// 				} else {
// 					return item;
// 				}
// 			}),
// 		};
// 	}
// }

// ---------------- v3

function moveTo(state: ClientViewItems, srcId: string, toParentId: string | undefined, childPos: number) {
	const src = state.entries[srcId];
	// console.log(`moving ${src.id} with parent ${src.parent} to parent ${toParentId} pos ${childPos}`);

	let roots;
	if (toParentId === undefined) {
		roots = state.roots.slice(0);
		roots.splice(childPos, 0, src.id);
	} else if (state.entries[srcId].parent === undefined) {
		roots = lodash.without(state.roots, src.id);
	} else {
		roots = state.roots;
	}

	return {
		...state,
		roots,
		entries: lodash.mapValues(state.entries, (item) => {
			switch (item.id) {
				case src.id:
					item = {
						...item,
						parent: toParentId,
					};
					break;
				case src.parent:
					item = {
						...item,
						childNotes: lodash.without(item.childNotes, src.id),
					};
					break;
				case toParentId: {
					const newChildNotes = item.childNotes.slice(0);
					newChildNotes.splice(childPos, 0, src.id);
					item = {
						...item,
						childNotes: newChildNotes,
					};
					break;
				}
				default:
			}

			return item;
		}),
	};
}
