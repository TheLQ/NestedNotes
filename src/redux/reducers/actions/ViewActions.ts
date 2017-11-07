import { Action } from "redux";

import { ActionType } from "./ActionType";

interface ViewAction extends Action {
	viewId: string;
}

export interface OptionalViewAction extends Action {
	viewId: string | undefined;
}

interface ViewActionValue<V> extends ViewAction {
	value: V;
}

export type SelectTagAction = ViewActionValue<string>;
export type SelectItemAction = ViewActionValue<string>;
export type SelectNextAction = ViewAction;
export type SelectNextActiveViewAction = Action;
export type SelectPrevAction = ViewAction;
export type SelectPrevActiveViewAction = Action;
export type MoveUpAction = OptionalViewAction;
export type MoveDownAction = OptionalViewAction;
export type MoveLeftAction = OptionalViewAction;
export type MoveRightAction = OptionalViewAction;
export type DeleteItemAction = ViewActionValue<string>;

export function activeTag(viewId: string, id: string): SelectTagAction {
	return {
		type: ActionType.TAG_FILTER,
		viewId,
		value: id,
	};
}

export function selectItem(viewId: string, id: string): SelectItemAction {
	return {
		type: ActionType.SELECT_ITEM,
		viewId,
		value: id,
	};
}

export function selectNext(viewId: string): SelectNextAction {
	return {
		type: ActionType.SELECT_ITEM_NEXT,
		viewId,
	};
}

export function selectNextActiveView(): SelectNextActiveViewAction {
	return {
		type: ActionType.SELECT_ITEM_NEXT_ACTIVE_VIEW,
	};
}

export function selectPrev(viewId: string): SelectPrevAction {
	return {
		type: ActionType.SELECT_ITEM_PREV,
		viewId,
	};
}

export function selectPrevActiveView(): SelectPrevActiveViewAction {
	return {
		type: ActionType.SELECT_ITEM_PREV_ACTIVE_VIEW,
	};
}

export function moveUp(viewId?: string): MoveUpAction {
	return {
		type: ActionType.MOVE_UP,
		viewId,
	};
}

export function moveDown(viewId?: string): MoveDownAction {
	return {
		type: ActionType.MOVE_DOWN,
		viewId,
	};
}

export function moveLeft(viewId?: string): MoveLeftAction {
	return {
		type: ActionType.MOVE_LEFT,
		viewId,
	};
}

export function moveRight(viewId?: string): MoveRightAction {
	return {
		type: ActionType.MOVE_RIGHT,
		viewId,
	};
}

export function deleteItem(viewId: string, item: string): DeleteItemAction {
	return {
		type: ActionType.DELETE_ITEM,
		viewId,
		value: item,
	};
}
