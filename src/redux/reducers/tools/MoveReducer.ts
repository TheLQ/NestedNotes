import { UserState } from "../../state/UserState";

import ActionType from "./ActionType";

export default MoveReducer;
function MoveReducer(
	state: string | null,
	type: ActionType,
	userData: UserState,
): string | null {
	switch (type) {
		case ActionType.INIT:
			return userData.rootNotes[0];
		case ActionType.SELECTED_ITEM:
			return value;
		case ActionType.SELECTED_ITEM_NEXT:
			if (state == null) {
				throw new Error("illegal state: null selection");
			}
			return selectionNext(state, userData);
		case ActionType.SELECTED_ITEM_PREV:
			if (state == null) {
				throw new Error("illegal state: null selection");
			}
			return selectionPrev(state, userData);
		default:
			return state;
	}
}

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
