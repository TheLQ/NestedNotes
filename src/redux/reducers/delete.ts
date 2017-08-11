import { ItemModel } from "../../model/item";
import { UserDataModel } from "../../model/userData";

export function deleteItem(item: ItemModel, root: UserDataModel) {
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
