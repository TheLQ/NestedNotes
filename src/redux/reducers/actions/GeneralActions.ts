import { Action } from "redux";

import { UserState } from "../../../state/user/UserState";

import { ActionType } from "../ActionType";

export interface InitUserAction extends Action {
	rawUserState: UserState;
}

export function initUser(givenUserState: UserState): InitUserAction {
	return {
		type: ActionType.INIT,
		rawUserState: givenUserState,
	};
}
