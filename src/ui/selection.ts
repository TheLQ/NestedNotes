import * as Config from "../config";
import * as EventHandlers from "./eventHandlers";
import {ItemComponent as ItemComponent} from "./item";

type IteratorUntilTrue = (currentItem: Config.Item) => boolean;

enum SelectionState {
	Enabled,
	Trigger,
	Done,
}

let activeSelection: Config.Item;
// select on init

EventHandlers.postReactInit.push((config: Config.Root) => {
	activeSelection = Config.getItem(Config.getActiveConfig().roots[0]);
	console.log("setting first active selection", activeSelection);
	ItemComponent.forItem(activeSelection.id).setState({
		isSelected: true,
	});
});

export function init() {
	console.log("init selection");
}

export function updateSelection(newSelection: Config.Item) {
	console.log("update selection", newSelection);
	// skip during init
	ItemComponent.forItem(activeSelection.id).setState({
		isSelected: false,
	});
	ItemComponent.forItem(newSelection.id).setState({
		isSelected: true,
	});
	activeSelection = newSelection;
}

export function selectionNext() {
	let result: Config.Item = activeSelection;

	if (result.children.length > 0) {
		result = Config.getItem(result.children[0]);
	} else {
		while (true) {
			const parent = result.getParent();
			if (parent.indexOfChild != parent.parentChildren.length - 1) {
				result = Config.getItem(parent.parentChildren[parent.indexOfChild + 1])
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
	let result: Config.Item = activeSelection;

	while (true) {
		const parent = result.getParent();
		if (parent.indexOfChild != 0) {
			result = Config.getItem(parent.parentChildren[parent.indexOfChild - 1])
			while (result.children.length != 0) {
				result = Config.getItem(result.children[result.children.length - 1]);
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
	if (document.activeElement instanceof HTMLTextAreaElement) {
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
