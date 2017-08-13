import { ItemState } from "../../state/ItemState";
import * as StateTools from "../../state/tools";
import { UserState } from "../../state/UserState";

import ActionType from "./ActionType";

export default function SelectionReducer(
	state: string | null,
	type: ActionType,
	value: any,
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

function selectionNext(selectedId: string, userData: UserState): string {
	const selected = userData.notes[selectedId];
	if (selected.childNotes.length > 0) {
		return selected.childNotes[0];
	} else {
		let child: ItemState = selected;
		while (true) {
			const parent = StateTools.getParent(child, userData);
			if (parent.indexOfChild !== parent.parentChildren.length - 1) {
				return parent.parentChildren[parent.indexOfChild + 1];
			} else {
				if (parent.parent == null) {
					// at last entry
					return selectedId;
				}
				child = parent.parent;
				continue;
			}
		}
	}
}

function selectionPrev(selectedId: string, userData: UserState): string {
	let child = userData.notes[selectedId];

	const parent = StateTools.getParent(child, userData);
	if (parent.indexOfChild !== 0) {
		let prevSiblingId: string = parent.parentChildren[parent.indexOfChild - 1];
		let prevSibling: ItemState = userData.notes[prevSiblingId];
		while (prevSibling.childNotes.length !== 0) {
			prevSiblingId = prevSibling.childNotes[prevSibling.childNotes.length - 1];
			prevSibling = userData.notes[prevSiblingId];
		}
		return prevSiblingId;
	} else {
		if (parent.parent == null) {
			// at first entry
			return selectedId;
		}
		// child = parent.parent;
		return parent.parent.id;
		// break;
	}

}
