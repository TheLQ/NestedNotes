import {
	AnyAction,
	// combineReducers,
	Reducer,
} from "redux";

import { AppDataModel } from "../../model/appData";
import { TagModel } from "../../model/tag";
import { UserDataModel } from "../../model/userData";

// import { InitAction, initUserDataReducer } from "./init";

export const INIT = "INIT";
// type TypeConsts = "INIT" | "ADD_ITEM";

export const ALL_REDUCERS: Reducer<AppDataModel> = function reducerWraper(
	state: AppDataModel,
	action: AnyAction): AppDataModel {
	switch (action.type) {
		case INIT:
			// return initUserDataReducer(state, action);
			return state;
		default:
			return state;
	}
};

export function initUserData(userData: UserDataModel): any {
	return {
		type: INIT,
		userData,
	};
}

export function activeTag(tag: TagModel): any {

	/*** TODO */
	// return {
	// 	type: INIT,
	// 	userData,
	// };
}
