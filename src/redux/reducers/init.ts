import { Action, Reducer } from "redux";

import { AppDataModel } from "../../model/appData";
import { UserDataModel } from "../../model/userData";

export const initUserDataReducer: Reducer<AppDataModel> = function initUserData(
	state: AppDataModel,
	action: InitAction): AppDataModel {
	return {
		...state,
		userData: action.userData,
	};
};

export interface InitAction extends Action {
	userData: UserDataModel;
}
