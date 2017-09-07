import { Action } from "redux";

import { ActionType } from "../ActionType";

interface ViewAction extends Action {
	viewId: string;
}

interface ViewActionValue<V> extends ViewAction {
	value: V;
}

// export type SelectBookAction = ViewActionValue<string>;
export type SelectTagAction = ViewActionValue<string>;
export type SelectItemAction = ViewActionValue<string>;
export type SelectNextAction = ViewAction;
export type SelectNextActiveViewAction = Action;
export type SelectPrevAction = ViewAction;
export type SelectPrevActiveViewAction = Action;

// export function selectBook(givenBookId: string): SelectBookAction {
// 	return {
// 		type: ActionType.SELECT_BOOK,
// 		value: givenBookId,
// 	}
// }

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
