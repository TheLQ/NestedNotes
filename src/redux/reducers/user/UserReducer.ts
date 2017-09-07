import lodash from "lodash";
import { AnyAction } from "redux";

import { UserState } from "../../../state/user/UserState";

import { InitUserAction } from "../actions/GeneralActions";
import { ActionType } from "../ActionType";

import { BookReducer } from "./BookReducer";

export function UserReducer(state: UserState, rawAction: AnyAction): UserState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			const action = rawAction as InitUserAction;
			state = action.rawUserState;

			return {
				...state,
				books: lodash.mapValues(state.books, (book) => {
					book = BookReducer(book, rawAction);

					return book;
				}),
			};
		}
		default:
			return state;
	}
}
