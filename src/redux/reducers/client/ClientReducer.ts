import { AnyAction } from "redux";

import { ClientState } from "../../../state/client/ClientState";
import { UserState } from "../../../state/user/UserState";

import ClientViewReducer from "./ClientViewReducer";

function ClientReducer(state: ClientState, userState: UserState, rawAction: AnyAction): ClientState {
	return {
		views: ClientViewReducer(state.views, userState, rawAction),
	};
}
export default ClientReducer;
