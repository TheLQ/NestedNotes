import { AnyAction } from "redux";

import { RootState } from "../../state/RootState";
import { ActionType } from "./actions/ActionType";

export function ViewsReducer(state: RootState, rawAction: AnyAction): RootState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			break;
		}
		default:
			return state;
	}
}
