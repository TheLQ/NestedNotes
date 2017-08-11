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
