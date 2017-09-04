import { AnyAction } from "redux";

import { initialState, RootState } from "../../state/RootState";

import ClientReducer from "./client/ClientReducer";
import UserReducer from "./user/UserReducer";

export default function RootReducer(state: RootState = initialState, rawAction: AnyAction): RootState {
	const newUserState = UserReducer(state.user, rawAction);
	return {
		user: newUserState,
		client: ClientReducer(state.client, newUserState, rawAction),
	};
}
