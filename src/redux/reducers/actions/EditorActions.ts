import { ActionType } from "./ActionType";
import { EntryAction, ValueEntryAction } from "./types";

export type EditorSetTextAction = ValueEntryAction<string>;
export type EditorAddTagAction = ValueEntryAction<string>;
export type EditorRemoveTagAction = ValueEntryAction<string>;
export type EditorAddLinkAction = ValueEntryAction<string>;
export type EditorRemoveLinkAction = ValueEntryAction<string>;
export type EditorSubmitAction = EntryAction;
export type EditorCancelAction = EntryAction;

export function setText(editorId: string, value: string): EditorSetTextAction {
	return {
		type: ActionType.EDITOR_SET_TEXT,
		entryId: editorId,
		value,
	};
}

export function addLink(editorId: string, link: string): EditorAddLinkAction {
	return {
		type: ActionType.EDITOR_ADD_LINK,
		entryId: editorId,
		value: link,
	};
}

export function removeLink(editorId: string, link: string): EditorRemoveLinkAction {
	return {
		type: ActionType.EDITOR_SET_TEXT,
		entryId: editorId,
		value: link,
	};
}

export function addTag(editorId: string, tag: string): EditorAddTagAction {
	return {
		type: ActionType.EDITOR_SET_TEXT,
		entryId: editorId,
		value: tag,
	};
}

export function removeTag(editorId: string, tag: string): EditorRemoveTagAction {
	return {
		type: ActionType.EDITOR_SET_TEXT,
		entryId: editorId,
		value: tag,
	};
}

export function cancel(editorId: string) {
	return {
		type: ActionType.EDITOR_CANCEL,
	};
}

export function submit(editorId: string) {
	return {
		type: ActionType.EDITOR_SUBMIT,
	};
}
