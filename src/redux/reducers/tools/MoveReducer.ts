import iassign from "immutable-assign";
import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { getActiveItem } from "../../../state/tools";
import { UserItemMap } from "../../../state/user/BookState";
import { ItemState } from "../../../state/user/ItemState";
import { BookMap } from "../../../state/user/UserState";
import { indexOfSafe } from "../../../utils";
import { ActionType } from "../actions/ActionType";
import { MoveDownAction, MoveLeftAction, MoveRightAction, MoveUpAction } from "../actions/ViewActions";

export function MoveReducer(
	state: BookMap,
	viewMap: ClientViewMap,
	rawAction: AnyAction,
): BookMap {
	switch (rawAction.type) {
		case ActionType.MOVE_UP: {
			const action = rawAction as MoveUpAction;

			return applyToBookFromView(state, viewMap, action.viewId, moveUp);
		}
		case ActionType.MOVE_DOWN: {
			const action = rawAction as MoveDownAction;

			return applyToBookFromView(state, viewMap, action.viewId, moveDown);
		}
		case ActionType.MOVE_LEFT: {
			const action = rawAction as MoveLeftAction;

			return applyToBookFromView(state, viewMap, action.viewId, moveLeft);
		}
		case ActionType.MOVE_RIGHT: {
			const action = rawAction as MoveRightAction;

			return applyToBookFromView(state, viewMap, action.viewId, moveRight);
		}
		default:
			return state;
	}
}
export function applyToBookFromView(
	state: BookMap,
	viewMap: ClientViewMap,
	viewIdRaw: string | undefined,
	callback: (userItems: UserItemMap, item: ItemState) => UserItemMap,
): BookMap {
	const item = getActiveItem(viewMap, viewIdRaw);

	return lodash.mapValues(
		state,
		(book) => (book.id === item.bookId)
			? {
				...book,
				items: callback(book.items, item),
			}
			: book,
	);
}

function moveUp(state: UserItemMap, item: ItemState): UserItemMap {
	return moveUpDown(state, item, -1);
}

function moveDown(state: UserItemMap, item: ItemState): UserItemMap {
	return moveUpDown(state, item, 1);
}

function moveUpDown(state: UserItemMap, item: ItemState, direction: number): UserItemMap {
	const stateInserter = (children: string[]): string[] => {
		const parentIndex = indexOfSafe(children, item.id, 0, `child ${item.id} does not exist in parent ${children}`);

		if ((parentIndex === 0 && direction === -1) || (parentIndex === children.length - 1 && direction === 1)) {
			// for direction=-1, causes 2nd splice to go negative
			// for direction=1, causes 2nd splice to (maybe) get reduced to actual last index by browser
			return children;
		}

		children.splice(parentIndex, 1);
		children.splice(parentIndex + (1 * direction), 0, item.id);

		return children;
	};

	if (item.parent === undefined) {
		return iassign(
			state,
			(newState) => newState.roots,
			stateInserter,
		);
	} else {
		const itemParent = item.parent;

		return iassign(
			state,
			(newState) => newState.entries[itemParent].children,
			stateInserter,
		);
	}
}

// moveLeft and moveRight v4

function moveLeft(state: UserItemMap, item: ItemState): UserItemMap {
	if (item.parent === undefined) {
		// is root item, can't go left anymore
		return state;
	}

	const parent = state.entries[item.parent];
	if (parent.parent === undefined) {
		// move child of root to sibling of root
		const rootIndex = state.roots.indexOf(parent.id);

		return moveTo(
			state,
			item.id,
			undefined,
			rootIndex + 1,
		);
	} else {
		// move child of parent to sibling of parent, or child of grandparent
		const grandParent = state.entries[parent.parent];
		const grandParentIndex = indexOfSafe(grandParent.children, parent.id);

		return moveTo(
			state,
			item.id,
			grandParent.id,
			grandParentIndex + 1,
		);
	}
}

function moveRight(state: UserItemMap, item: ItemState): UserItemMap {
	const parentChildren = (item.parent === undefined)
		? state.roots
		: state.entries[item.parent].children;
	const parentIndex = indexOfSafe(parentChildren, item.id);
	if (parentIndex === 0) {
		return state;
	}

	const toParentId = parentChildren[parentIndex - 1];
	const toParent = state.entries[toParentId];

	return moveTo(
		state,
		item.id,
		toParentId,
		toParent.children.length,
	);
}

function moveTo(state: UserItemMap, srcId: string, toParentId: string | undefined, childPos: number) {
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
						children: lodash.without(item.children, src.id),
					};
					break;
				case toParentId: {
					const newChildNotes = item.children.slice(0);
					newChildNotes.splice(childPos, 0, src.id);
					item = {
						...item,
						children: newChildNotes,
					};
					break;
				}
				default:
			}

			return item;
		}),
	};
}
