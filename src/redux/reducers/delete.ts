import { ItemState } from "../../state/item";
import { UserState } from "../../state/user";

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