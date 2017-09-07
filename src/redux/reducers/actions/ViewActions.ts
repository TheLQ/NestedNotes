import { Action } from "redux";

import ActionType from "../ActionType";

interface ViewAction extends Action {
	viewId: string;
}

interface ViewActionValue<V> extends ViewAction {
	value: V;
}

// export type SelectedBookAction = ViewActionValue<string>;
export type SelectedTagAction = ViewActionValue<string>;
export type SelectedItemAction = ViewActionValue<string>;
export type SelectedNextAction = ViewAction;
export type SelectedNextActiveViewAction = Action;
export type SelectedPrevAction = ViewAction;
export type SelectedPrevActiveViewAction = Action;

// export function selectedBook(givenBookId: string): SelectedBookAction {
// 	return {
// 		type: ActionType.SELECTED_BOOK,
// 		value: givenBookId,
// 	}
// }

export function activeTag(viewId: string, id: string): SelectedTagAction {
	return {
		type: ActionType.TAG_FILTER,
		viewId,
		value: id,
	};
}

export function selectedItem(viewId: string, id: string): SelectedItemAction {
	return {
		type: ActionType.SELECTED_ITEM,
		viewId,
		value: id,
	};
}

export function selectedNext(viewId: string): SelectedNextAction {
	return {
		type: ActionType.SELECTED_ITEM_NEXT,
		viewId,
	};
}

export function selectedNextActiveView(): SelectedNextActiveViewAction {
	return {
		type: ActionType.SELECTED_ITEM_NEXT_ACTIVE_VIEW,
	};
}

export function selectedPrev(viewId: string): SelectedPrevAction {
	return {
		type: ActionType.SELECTED_ITEM_PREV,
		viewId,
	};
}

export function selectedPrevActiveView(): SelectedPrevActiveViewAction {
	return {
		type: ActionType.SELECTED_ITEM_PREV_ACTIVE_VIEW,
	};
}
