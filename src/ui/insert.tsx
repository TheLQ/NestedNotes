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
	doInsert("above", true, (oldState, active, created) => {
		const activeIndex = oldState.itemTree.children.indexOf(active.id);
		if (activeIndex === -1) {
			console.log("ItemState", oldState);
			throw new Error("activeIndex " + activeIndex + " not found in " + oldState.itemTree.children);
		}
		oldState.itemTree.children.splice(activeIndex, 0, created.id);
	});
}

function insertBelow() {
	doInsert("below", true, (oldState, active, created) => {
		const activeIndex = oldState.itemTree.children.indexOf(active.id);
		if (activeIndex === -1) {
			console.log("ItemState", oldState);
			throw new Error("activeIndex " + activeIndex + " not found in " + oldState.itemTree.children);
		}
		oldState.itemTree.children.splice(activeIndex + 1, 0, created.id);
	});
}

function insertRight() {
	doInsert("right", false, (oldState, active, created) => {
		oldState.itemTree.children.push(created.id);
		// oldState.itemTree.children.splice(0, 0, created.id);
	});
}

function doInsert(
	direction: string,
	forParent: boolean,
	callback: (oldState: ItemState, activeSelection: Config.Item, createdItem: Config.Item) => void) {

	const active = Selection.getActiveSelection();
	console.log("insert " + direction + " this:", active);

	const parentToChange = forParent ? active.parent : active.id;

	const createdItem = newItem();
	createdItem.parent = parentToChange;

	setStatePostReact(createdItem);

	ItemComponent.forItem(parentToChange)
		.setState((oldState: ItemState) => {
			callback(oldState, active, createdItem)
			createdItem.validate(Config.getActiveConfig());
		});
}

function setStatePostReact(itemToEdit: Config.Item) {
	const editListener = (removed: boolean, item: ItemComponent) => {
		if (item.props.itemId !== itemToEdit.id) {
			return;
		}
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
}

document.addEventListener("keypress", function editKeyPressListener(e: KeyboardEvent) {
	if (e.key === "W" && e.shiftKey === true) {
		insertAbove();
	} else if (e.key === "S" && e.shiftKey === true) {
		insertBelow();
	} else if (e.key === "D" && e.shiftKey === true) {
		insertRight();
	}
});
