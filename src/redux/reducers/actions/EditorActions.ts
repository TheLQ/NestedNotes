import { ActionType } from "./ActionType";
import { EntryAction, ValueEntryAction } from "./types";
import { OptionalViewAction } from "./ViewActions";

export type EditorNewAction = OptionalViewAction;
export type EditorInsertAboveAction = OptionalViewAction;
export type EditorInsertBelowAction = OptionalViewAction;
export type EditorInsertLeftAction = OptionalViewAction;
export type EditorInsertRightAction = OptionalViewAction;
export type EditorSetTextAction = ValueEntryAction<string>;
export type EditorSetTextRawAction = ValueEntryAction<string>;
export type EditorAddTagAction = ValueEntryAction<string>;
export type EditorRemoveTagAction = ValueEntryAction<string>;
export type EditorSetTagsAction = ValueEntryAction<string[]>;
export type EditorAddLinkAction = ValueEntryAction<string>;
export type EditorRemoveLinkAction = ValueEntryAction<string>;
export type EditorSetLinksAction = ValueEntryAction<string[]>;
export type EditorSubmitAction = EntryAction;
export type EditorCancelAction = EntryAction;

export function newEditor(viewId?: string): EditorNewAction {
	return {
		type: ActionType.EDITOR_NEW,
		viewId,
	};
}

export function insertAbove(viewId?: string): EditorInsertAboveAction {
	return {
		type: ActionType.EDITOR_INSERT_ABOVE,
		viewId,
	};
}

export function insertBelow(viewId?: string): EditorInsertBelowAction {
	return {
		type: ActionType.EDITOR_INSERT_BELOW,
		viewId,
	};
}

export function insertLeft(viewId?: string): EditorInsertLeftAction {
	return {
		type: ActionType.EDITOR_INSERT_LEFT,
		viewId,
	};
}

export function insertRight(viewId?: string): EditorInsertRightAction {
	return {
		type: ActionType.EDITOR_INSERT_RIGHT,
		viewId,
	};
}

export function setText(editorId: string, value: string): EditorSetTextAction {
	return {
		type: ActionType.EDITOR_SET_TEXT,
		entryId: editorId,
		value,
	};
}

export function setTextRaw(editorId: string, value: string): EditorSetTextAction {
	return {
		type: ActionType.EDITOR_SET_TEXT_RAW,
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
		type: ActionType.EDITOR_REMOVE_LINK,
		entryId: editorId,
		value: link,
	};
}

export function setLinks(editorId: string, links: string[]): EditorSetLinksAction {
	return {
		type: ActionType.EDITOR_SET_LINKS,
		entryId: editorId,
		value: links,
	};
}

export function addTag(editorId: string, tag: string): EditorAddTagAction {
	return {
		type: ActionType.EDITOR_ADD_TAG,
		entryId: editorId,
		value: tag,
	};
}

export function removeTag(editorId: string, tag: string): EditorRemoveTagAction {
	return {
		type: ActionType.EDITOR_REMOVE_TAG,
		entryId: editorId,
		value: tag,
	};
}

export function setTags(editorId: string, tags: string[]): EditorSetTagsAction {
	return {
		type: ActionType.EDITOR_SET_TAGS,
		entryId: editorId,
		value: tags,
	};
}

export function cancel(editorId: string): EditorCancelAction {
	return {
		type: ActionType.EDITOR_CANCEL,
		entryId: editorId,
	};
}

export function submit(editorId: string): EditorSubmitAction {
	return {
		type: ActionType.EDITOR_SUBMIT,
		entryId: editorId,
	};
}
