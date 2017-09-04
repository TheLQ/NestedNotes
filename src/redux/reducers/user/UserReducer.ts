import lodash from "lodash";
import { AnyAction } from "redux";

import { UserState } from "../../../state/user/UserState";

import { InitUserAction } from "../actions/GeneralActions";
import ActionType from "../ActionType";

// import SelectionReducer from "../tools/SelectionReducer";
import BookReducer from "./BookReducer";


function UserReducer(state: UserState, rawAction: AnyAction): UserState {
	state = {
		...state,
		books: lodash.mapValues(state.books, (book) => {
			book = BookReducer(book, rawAction);
			// book = SelectionReducer(book, rawAction);
			return book;
		}),
	};

	switch (rawAction.type) {
		case ActionType.INIT: {
			const action = rawAction as InitUserAction;
			state = action.rawUserState;
			break;
		}
	}

	return state;
}
export default UserReducer;
