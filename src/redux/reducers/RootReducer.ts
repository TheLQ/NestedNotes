import iassign from "immutable-assign";
import { AnyAction } from "redux";

import { initialState, RootState } from "../../state/RootState";
import { DEFAULT_IASSIGN_OPS } from "../../utils";
import { ActionType } from "./actions/ActionType";
import { InitUserAction } from "./actions/GeneralActions";
import { ClientReducer } from "./client/ClientReducer";
import { EditorReducer } from "./tools/EditorReducer";
import { MoveReducer } from "./tools/MoveReducer";
import { UserReducer } from "./user/UserReducer";

export function RootReducer(state: RootState = initialState, rawAction: AnyAction): RootState {
	if (rawAction.type === ActionType.INIT) {
		const action = rawAction as InitUserAction;

		state = iassign(
			state,
			(newState) => {
				newState.user = action.rawUserState;

				return newState;
			},
			DEFAULT_IASSIGN_OPS,
		);
	}

	let newUserState = UserReducer(state.user, state.client, rawAction);
	newUserState = {
		...newUserState,
		books: MoveReducer(newUserState.books, state.client.views, rawAction),
		// TODO: is this safe in the same instance as MoveReducer?
	};
	newUserState = EditorReducer(newUserState, state.client.views, rawAction);

	state = {
		user: newUserState,
		client: ClientReducer(state.client, newUserState, rawAction),
	};

	return state;
}
