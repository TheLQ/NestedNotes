import { AnyAction } from "redux";

import { UserViewMap } from "../../../state/user/UserState";

export function UserViewReducer(state: UserViewMap, rawAction: AnyAction): UserViewMap {
	return state;
}
