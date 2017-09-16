import { AnyAction } from "redux";

import { initialState, RootState } from "../../state/RootState";
import { ClientReducer } from "./client/ClientReducer";
import { MoveReducer } from "./tools/MoveReducer";
import { UserReducer } from "./user/UserReducer";

export function RootReducer(state: RootState = initialState, rawAction: AnyAction): RootState {
	let newUserState = UserReducer(state.user, rawAction);
	newUserState = {
		...newUserState,
		books: MoveReducer(newUserState.books, state.client.views, rawAction),
	},

	state = {
		user: newUserState,
		client: ClientReducer(state.client, newUserState, rawAction),
	};

	return state;
}
