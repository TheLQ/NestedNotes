import { AnyAction } from "redux";
import { ClientViewMap } from "../../../state/client/ClientState";
import { ItemState } from "../../../state/user/ItemState";
import { UserState } from "../../../state/user/UserState";

export function deleteItem(item: ItemState, root: UserState) {
	// const parent = getItem(root, item.parent);
	// if (parent != null) {
	// 	parent.children.splice(
	// 		Utils.indexOfOrError(parent.children, item.id),
	// 		1,
	// 	);
	// } else {
	// 	root.children.splice(
	// 		Utils.indexOfOrError(root.children, item.id),
	// 		1,
	// 	);
	// }
}

export function DeleteReducer(
	state: ClientViewMap,
	rawAction: AnyAction,
): ClientViewMap {
	switch (rawAction.type) {
		default:
			return state;
	}
}
