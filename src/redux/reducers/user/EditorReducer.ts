import { AnyAction } from "redux";

import { transformStringMap } from "../../../state/tools";
import { EditorState } from "../../../state/user/EditorState";
import { EditorMap } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";
import { EditorSetTextAction } from "../actions/EditorActions";

export function EditorReducer(
	state: EditorMap,
	rawAction: AnyAction,
): EditorMap {
	switch (rawAction.type) {
		case ActionType.EDITOR_SET_TEXT:
			const setTextAction = rawAction as EditorSetTextAction;

			return ifEditorId(state, setTextAction.entryId, (itemState) => ({
				...itemState,
				textValue: setTextAction.value,
			}));
		default:
			return state;
	}
}

function ifEditorId(
	state: EditorMap,
	editorId: string,
	callback: (view: EditorState) => EditorState,
): EditorMap {
	return transformStringMap(state, editorId, (view) => {
		if (view.id === editorId) {
			return callback(view);
		} else {
			return view;
		}
	});
}
