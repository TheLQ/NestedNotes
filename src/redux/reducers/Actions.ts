import { AnyAction } from "redux";

import { TagState } from "../../state/tag";
import { UserState } from "../../state/user";

import ActionType from "./ActionType";

export function initUser(newUserState: UserState): AnyAction {
	return {
		type: ActionType.INIT,
		value: newUserState,
	};
}

export function activeTag(newTag: TagState): AnyAction {
	return {
		type: ActionType.TAG_FILTER,
		value: newTag,
	};
}

export function selectedItem(id: string): AnyAction {
	return {
		type: ActionType.SELECTED_ITEM,
		value: id,
	};
}

export function selectedNext(): AnyAction {
	return {
		type: ActionType.SELECTED_ITEM_NEXT,
	};
}

export function selectedPrev(): AnyAction {
	return {
		type: ActionType.SELECTED_ITEM_PREV,
	};
}
