import iassign from "immutable-assign";
import { AnyAction } from "redux";
import uuid from "uuid";

import { ClientViewMap } from "../../../state/client/ClientState";
import { getActiveItem, getParent } from "../../../state/tools";
import { ItemState } from "../../../state/user/ItemState";
import { EditorMap, UserState } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";
import {
	EditorInsertAboveAction,
	EditorInsertBelowAction,
	EditorInsertLeftAction,
	EditorInsertRightAction,
} from "../actions/EditorActions";

export function InsertReducer(
	state: UserState,
	viewMap: ClientViewMap,
	rawAction: AnyAction,
): UserState {
	switch (rawAction.type) {
		case ActionType.EDITOR_INSERT_ABOVE: {
			const action = rawAction as EditorInsertAboveAction;
			const activeItem = getActiveItem(viewMap, action.viewId);
			const activeParent = getParent(state.books[activeItem.bookId].items, activeItem);

			return pushNewItemVertical(
				state,
				activeItem.bookId,
				activeItem.id,
				activeParent.parentId,
				(children, activeId, newId) => {
					children.splice(children.indexOf(activeId), 0, newId);

					return children;
				},
			);
		}
		case ActionType.EDITOR_INSERT_BELOW: {
			const action = rawAction as EditorInsertBelowAction;
			const activeItem = getActiveItem(viewMap, action.viewId);
			const activeParent = getParent(state.books[activeItem.bookId].items, activeItem);

			return pushNewItemVertical(
				state,
				activeItem.bookId,
				activeItem.id,
				activeParent.parentId,
				(children, activeId, newId) => {
					children.splice(children.indexOf(activeId) + 1, 0, newId);

					return children;
				},
			);
		}
		case ActionType.EDITOR_INSERT_LEFT: {
			const action = rawAction as EditorInsertLeftAction;
			const activeItem = getActiveItem(viewMap, action.viewId);

			const activeParent = getParent(state.books[activeItem.bookId].items, activeItem);
			// get grandparent id
			const relativeActiveId = (activeParent.parentId !== undefined)
				? activeParent.parentId
				: activeItem.id;
			const parentId = (activeParent.parent !== undefined)
				? activeParent.parent.parent
				: undefined;

			return pushNewItemVertical(
				state,
				activeItem.bookId,
				relativeActiveId,
				parentId,
				(children, activeId, newId) => {
					children.splice(children.indexOf(activeId) + 1, 0, newId);

					return children;
				},
			);
		}
		case ActionType.EDITOR_INSERT_RIGHT: {
			const action = rawAction as EditorInsertRightAction;
			const activeItem = getActiveItem(viewMap, action.viewId);

			return pushNewItemVertical(
				state,
				activeItem.bookId,
				activeItem.id,
				activeItem.id,
				(children, activeId, newId) => {
					children.splice(children.indexOf(activeId) + 1, 0, newId);

					return children;
				},
			);
		}
		default:
			return state;
	}
}

function pushNewItemVertical(
	state: UserState,
	bookId: string,
	activeId: string,
	newItemParent: string | undefined,
	merge: (children: string[], activeId: string, newId: string) => string[],
): UserState {
	const newId = uuid.v4();

	const newItem: ItemState = {
		id: newId,
		parent: newItemParent,
		children: [],
		name: "",
		text: "placeholder",
		tags: [],
		links: [],
	};

	// push editor
	state = iassign(
		state,
		(newState) => newState.editors,
		(newState) => {
			// tslint:disable-next-line:arrow-return-shorthand
			const val: EditorMap = {
				...newState,
				[newId]: {
					id: newId,
					parent: newItemParent,
					bookId,
					links: [],
					tags: [],
					text: newItem.text,
					textRaw: newItem.text,
					deleteOnCancel: true,
				},
			};

			return val;
		},
	);

	// push item
	state = iassign(
		state,
		(newState, ctx) => newState.books[ctx.bookId].items.entries,
		(newState) => ({
			...newState,
			[newId]: newItem,
		}),
		{ bookId },
	);

	if (newItemParent === undefined) {
		// add to book root
		state = iassign(
			state,
			(newState, ctx) => newState.books[ctx.bookId].items.roots,
			(newState) => merge(newState, activeId, newId),
			{ bookId },
		);
	} else {
		// add to parent children
		state = iassign(
			state,
			(newState, ctx) => newState.books[ctx.bookId].items.entries,
			(newState) => ({
				...newState,
				[newItemParent]: {
					...newState[newItemParent],
					children: merge(newState[newItemParent].children, activeId, newId),
				},
			}),
			{ bookId },
		);
	}

	return state;
}
