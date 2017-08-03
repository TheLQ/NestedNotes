import * as ActiveRoot from "../model/active";
import * as Utils from "../utils";
import * as Edit from "./edit";
import {ItemComponent, ItemState} from "./item";
import * as Selection from "./selection";

function moveLeft() {
	const active = Selection.getActiveSelection();
	const parent = ActiveRoot.getActiveConfig().getItem(active.parent);
	const grandparent = ActiveRoot.getActiveConfig().getItem(parent.parent);

	ItemComponent.forItem(grandparent.id).setState((oldState: ItemState) => {
		const parentChildren = oldState.itemTree.children;
		if (parentChildren.indexOf(active.id) === 0) {
			// first in list, do nothing
			return;
		}

		Utils.deleteFrom(parentChildren, active.id);

		const parentIndexInGrandparent = Utils.indexOfOrError(grandparent.children, active.parent);
		oldState.itemTree.children.splice(parentIndexInGrandparent, 0, active.id);

		active.parent = grandparent.id;

		ActiveRoot.saveActiveConfig();
	});
}

function moveRight() {
	const active = Selection.getActiveSelection();

	ItemComponent.forItem(active.parent).setState((oldState: ItemState) => {
		const parentChildren = oldState.itemTree.children;
		if (parentChildren.indexOf(active.id) === 0) {
			// first in list, do nothing
			return;
		}

		const oldActiveIndex = Utils.deleteFrom(parentChildren, active.id);

		const prevChild = ActiveRoot.getActiveConfig().getItem(parentChildren[oldActiveIndex - 1]);
		prevChild.children.push(active.id);

		active.parent = prevChild.id;

		ActiveRoot.saveActiveConfig();
	});
}

function moveDown() {
	const active = Selection.getActiveSelection();

	ItemComponent.forItem(active.parent).setState((oldState: ItemState) => {
		const parentChildren = oldState.itemTree.children;
		const activeIndex = parentChildren.indexOf(active.id);
		if (activeIndex === parentChildren.length - 1) {
			// at end of list, do nothing
			return;
		}

		const old = parentChildren[activeIndex + 1];
		parentChildren[activeIndex + 1] = parentChildren[activeIndex];
		parentChildren[activeIndex] = old;

		ActiveRoot.saveActiveConfig();
	});
}

document.addEventListener("keyup", function moveKeyPressListener(e: KeyboardEvent) {
	// stop from triggering inside edit
	if (Edit.insideForm()) {
		return;
	}
	console.log("e", e);
	if (e.key === "ArrowLeft") {
		// stop from triggering inside edit
		// e.preventDefault();

		moveLeft();
	} else if (e.key === "ArrowRight") {
		// stop from triggering inside edit
		// e.preventDefault();

		moveRight();
	} else if (e.key === "ArrowDown") {
		// stop scroll?
		e.preventDefault();

		moveDown();
	}
});
