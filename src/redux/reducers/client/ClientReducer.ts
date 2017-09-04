import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientState } from "../../../state/client/ClientState";
import { UserState } from "../../../state/user/UserState";

import ActionType from "../ActionType";
import ViewClientReducer from "./ViewClientReducer";

import { getFirstInMapOrError } from "../../../utils";

function ClientReducer(state: ClientState, userState: UserState, rawAction: AnyAction): ClientState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			const newViews = lodash.mapValues(
				userState.views,
				(userView) => ViewClientReducer(null, userView, userState, rawAction),
			);
			return {
				views: newViews,
				activeViewId: getFirstInMapOrError(newViews).viewId,
			};
		}
		default:
			return state;
	}
}
export default ClientReducer;
