import uuid from "uuid/v4";
import * as Config from "../config";
import {ItemComponent, ItemState} from "./item";
import * as Selection from "./selection";

function newItem(): Config.Item {
	const item = new Config.Item();
	item.id = uuid();

	Config.getActiveConfig().notes.set(item.id, item);
	return item;
}

function insertAbove() {
	const active = Selection.getActiveSelection();
	console.log("active", active);
	// const parent = Config.getItem(active.parent);

	const createdItem = newItem();
	createdItem.parent = active.parent;

	const editListener = (removed: boolean, item: ItemComponent) => {
		item.setState({
			isEditing: true,
		});
		Selection.updateSelection(item.state.itemTree);

		// remove this temporary listener
		ItemComponent.componentRefListeners.splice(
			ItemComponent.componentRefListeners.indexOf(editListener),
			1,
		);
	};
	ItemComponent.componentRefListeners.push(editListener);

	ItemComponent.forItem(active.parent).setState((oldState: ItemState) => {
		const activeIndex = oldState.itemTree.children.indexOf(active.id);
		if (activeIndex === -1) {
			console.log("ItemState", oldState);
			throw new Error("activeIndex " + activeIndex + " not found in " + oldState.itemTree.children);
		}
		oldState.itemTree.children.splice(activeIndex, 0, createdItem.id);
	});
}

document.addEventListener("keypress", function editKeyPressListener(e: KeyboardEvent) {
	if (e.key === "W" && e.shiftKey === true) {
		e.stopPropagation();
		insertAbove();
	}
});
