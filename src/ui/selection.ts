import * as ActiveRoot from "../model/active";
import ItemModel from "../model/item";
import RootModel from "../model/root";
import * as Edit from "./edit";
import * as EventHandlers from "./eventHandlers";
import {ItemComponent as ItemComponent} from "./item";

type IteratorUntilTrue = (currentItem: ItemModel) => boolean;

enum SelectionState {
	Enabled,
	Trigger,
	Done,
}

let activeSelection: ItemModel;
// select on init

EventHandlers.postReactInit.push((config: RootModel) => {
	activeSelection = ActiveRoot.getActiveConfig().getItem(ActiveRoot.getActiveConfig().children[0]);
	console.log("setting first active selection", activeSelection);
	ItemComponent.forItem(activeSelection.id).setState({
		isSelected: true,
	});
});

export function init() {
	console.log("init selection");
}

export function updateSelection(newSelection: ItemModel, forced: boolean = false) {
	console.log("update selection", newSelection);
	// skip during init
	const activeComponent = ItemComponent.forItem(activeSelection.id, false);
	if (activeComponent != null) {
		activeComponent.setState({
			isSelected: false,
		});
	}
	ItemComponent.forItem(newSelection.id).setState({
		isSelected: true,
	});
	activeSelection = newSelection;
}

export function selectionNext() {
	let result: ItemModel = activeSelection;

	if (result.children.length > 0) {
		result = ActiveRoot.getActiveConfig().getItem(result.children[0]);
	} else {
		while (true) {
			const parent = result.getParent(ActiveRoot.getActiveConfig());
			if (parent.indexOfChild != parent.parentChildren.length - 1) {
				result = ActiveRoot.getActiveConfig().getItem(parent.parentChildren[parent.indexOfChild + 1])
				break;
			} else  {
				if (parent.parent == null) {
					// at last entry
					return;
				}
				result = parent.parent;
				continue;
			}
		}
	}

	updateSelection(result);
}

export function selectionPrev() {
	let result: ItemModel = activeSelection;

	while (true) {
		const parent = result.getParent(ActiveRoot.getActiveConfig());
		if (parent.indexOfChild != 0) {
			result = ActiveRoot.getActiveConfig().getItem(parent.parentChildren[parent.indexOfChild - 1])
			while (result.children.length != 0) {
				result = ActiveRoot.getActiveConfig().getItem(result.children[result.children.length - 1]);
			}
			break;
		} else  {
			if (parent.parent == null) {
				// at first entry
				return;
			}
			result = parent.parent;
			break;
		}
	}

	updateSelection(result);
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
	// disable selection when inside edit box
	if (Edit.insideForm()) {
		return;
	}
	if (e.charCode === "s".charCodeAt(0)) {
		selectionNext();
	} else if (e.charCode === "w".charCodeAt(0)) {
		selectionPrev();
	}
});

export function getActiveSelection() {
	return activeSelection;
}
