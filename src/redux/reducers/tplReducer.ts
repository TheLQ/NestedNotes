import ActionType from "./ActionType";
import { RootState } from "../../state/RootState";
import { AnyAction } from "redux";
import { ViewState } from "../../state/ViewState";

function ViewsReducer(state: RootState, rawAction: AnyAction): RootState {
	switch (rawAction.type) {
		case ActionType.INIT: {
			
			break;
		}
		default:
			return state;
	}
}
export default ViewsReducer(null, {type: null});
