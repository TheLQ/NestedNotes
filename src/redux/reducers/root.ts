import { AnyAction } from "redux";

import { initialState, RootState } from "../../state/root";

import ActionType from "./ActionType";
import UserReducer from "./UserReducer";

export default function rootReducer(state: RootState = initialState, action: AnyAction): RootState {
	const type: ActionType = action.type;
	const value = action.value;

	const newUserData = UserReducer(state.userData, type, value);
	return {
		userData: newUserData,
		selectedTag: type === ActionType.TITLE ?  value : state.selectedTag,
		activeRoots: newUserData.rootNotes,
	};
}
