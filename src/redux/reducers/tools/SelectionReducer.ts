import { AnyAction } from "redux";

import * as StateTools from "../../../state/tools";
import { BookState } from "../../../state/user/BookState";
import { ItemState } from "../../../state/user/ItemState";

import {
	SelectedItemAction
} from "../actions/BookActions";
import ActionType from "../ActionType";

export default SelectionReducer;
function SelectionReducer(
	state: BookState,
	rawAction: AnyAction,
): BookState {
	switch (rawAction.type) {
		case ActionType.SELECTED_ITEM: {
			const action = rawAction as SelectedItemAction;
			return {
				...state,
				selectedItem: action.value,
			};
		}
		case ActionType.SELECTED_ITEM_NEXT: {
			if (state == null) {
				throw new Error("illegal state: null selection");
			}
			return {
				...state,
				selectedItem: selectionNext(state),
			};
		}
		case ActionType.SELECTED_ITEM_PREV: {
			return {
				...state,
				selectedItem: selectionPrev(state),
			};
		}
		default:
			return state;
	}
}

function selectionNext(book: BookState): string {
	if (book.selectedItem == null) {
		throw new Error("illegal state: null selection");
	}
	const selectedId = book.selectedItem;
	const selected = book.items[selectedId];
	if (selected.childNotes.length > 0) {
		return selected.childNotes[0];
	} else {
		let child: ItemState = selected;
		while (true) {
			const parent = StateTools.getParent(child, book);
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

function selectionPrev(book: BookState): string {
	if (book.selectedItem == null) {
		throw new Error("illegal state: null selection");
	}
	const selectedId = book.selectedItem;
	let child = book.items[selectedId];

	const parent = StateTools.getParent(child, book);
	if (parent.indexOfChild !== 0) {
		let prevSiblingId: string = parent.parentChildren[parent.indexOfChild - 1];
		let prevSibling: ItemState = book.items[prevSiblingId];
		while (prevSibling.childNotes.length !== 0) {
			prevSiblingId = prevSibling.childNotes[prevSibling.childNotes.length - 1];
			prevSibling = book.items[prevSiblingId];
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
