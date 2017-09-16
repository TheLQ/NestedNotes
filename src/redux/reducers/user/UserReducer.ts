import { AnyAction } from "redux";

import { UserState } from "../../../state/user/UserState";
import { BookReducer } from "./BookReducer";
import { EditorReducer } from "./EditorReducer";
import { UserTagReducer } from "./UserTagReducer";
import { UserViewReducer } from "./UserViewReducer";

export function UserReducer(state: UserState, rawAction: AnyAction): UserState {
	return {
		...state,
		books: BookReducer(state.books, rawAction),
		views: UserViewReducer(state.views, rawAction),
		editors: EditorReducer(state.editors, rawAction),
		tags: UserTagReducer(state.tags, rawAction),
	};
}
