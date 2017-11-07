import { AnyAction } from "redux";

import { ClientState } from "../../../state/client/ClientState";
import { UserState } from "../../../state/user/UserState";
import { BookReducer } from "./BookReducer";
import { UserTagReducer } from "./UserTagReducer";
import { UserViewReducer } from "./UserViewReducer";

export function UserReducer(state: UserState, clientState: ClientState, rawAction: AnyAction): UserState {
	return {
		...state,
		books: BookReducer(state.books, rawAction),
		views: UserViewReducer(state.views, rawAction),
		tags: UserTagReducer(state.tags, rawAction),
	};
}
