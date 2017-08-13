import { AnyAction } from "redux";

import { initialState, RootState } from "../../state/root";

import ActionType from "./ActionType";
import SelectionReducer from "./SelectionReducer";
import UserReducer from "./UserReducer";

export default function RootReducer(state: RootState = initialState, action: AnyAction): RootState {
	const type: ActionType = action.type;
	const value = action.value;

	const newUserData = UserReducer(state.userData, type, value);

	return {
		userData: newUserData,
		selectedTag: type === ActionType.SELECTED_TAG ?  value : state.selectedTag,
		selectedItem: SelectionReducer(state.selectedItem, type, value, newUserData),
		activeRoots: newUserData.rootNotes,
	};
}
