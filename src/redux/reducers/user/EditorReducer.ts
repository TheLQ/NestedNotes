import { InsertReducer } from "./InsertReducer";
import lodash from "lodash";
import { AnyAction } from "redux";

import { ClientViewMap } from "../../../state/client/ClientState";
import { getActiveItem } from "../../../state/tools";
import { EditorState } from "../../../state/user/EditorState";
import { EditorMap, UserState } from "../../../state/user/UserState";
import { ActionType } from "../actions/ActionType";
import {
    EditorCancelAction,
    EditorNewAction,
    EditorSetLinksAction,
    EditorSetTagsAction,
    EditorSetTextAction,
    EditorSetTextRawAction,
    EditorSubmitAction,
} from "../actions/EditorActions";

export function EditorReducer(
	state: UserState,
	viewMap: ClientViewMap,
	rawAction: AnyAction,
): UserState {
	state = InsertReducer(state, viewMap, rawAction);

	switch (rawAction.type) {
		// Note: ActionType.EDITOR_SUBMIT lives in BookReducer
		case ActionType.INIT:
			return state;
		case ActionType.EDITOR_NEW: {
			const action = rawAction as EditorNewAction;

			const item = getActiveItem(viewMap, action.viewId);

			const tags = (item.tags.length > 0)
				? " " + lodash.join(
					lodash.map(item.tags, (tag) => `#${tag}`),
					"",
				)
				: "";
			const links = (item.links.length > 0)
				? "\n\n" + lodash.join(item.links, "\n")
				: "";

			return {
				...state,
				editors: {
					...state.editors,
					[item.id]: {
						id: item.id,
						parent: item.parent,
						bookId: item.bookId,
						text: item.text,
						textRaw: item.text + tags + links,
						tags: item.tags,
						links: item.links,
						deleteOnCancel: false,
					},
				},
			};
		}
		case ActionType.EDITOR_SET_TEXT: {
			const action = rawAction as EditorSetTextAction;

			return {
				...state,
				editors: ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						text: action.value,
					}),
				),
			};
		}
		case ActionType.EDITOR_SET_TEXT_RAW: {
			const action = rawAction as EditorSetTextRawAction;

			return {
				...state,
				editors: ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						textRaw: action.value,
					}),
				),
			};
		}
		case ActionType.EDITOR_SET_LINKS: {
			const action = rawAction as EditorSetLinksAction;

			return {
				...state,
				editors: ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						links: action.value,
					}),
				),
			};
		}
		case ActionType.EDITOR_ADD_TAG: {
			const action = rawAction as EditorSetTextAction;

			return {
				...state,
				editors:  ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						tags: lodash.uniq(lodash.concat(curEditor.tags, action.value)),
					}),
				),
			};
		}
		case ActionType.EDITOR_REMOVE_TAG: {
			const action = rawAction as EditorSetTextAction;

			return {
				...state,
				editors:  ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						tags: lodash.without(curEditor.tags, action.value),
					}),
				),
			};
		}
		case ActionType.EDITOR_SET_TAGS: {
			const action = rawAction as EditorSetTagsAction;

			return {
				...state,
				editors: ifEditorId(
					state.editors,
					action.entryId,
					(curEditor) => ({
						...curEditor,
						tags: action.value,
					}),
				),
			};
		}
		case ActionType.EDITOR_SUBMIT: {
			const action = rawAction as EditorSubmitAction;

			const editor = state.editors[action.entryId];

			return {
				...state,
				editors: lodash.omit(state.editors, editor.id),
				books: lodash.mapValues(
					state.books,
					(book) => (book.id === editor.bookId)
						? {
							...book,
							items: {
								...book.items,
								entries: lodash.mapValues(book.items.entries, (item) => {
									if (item.id !== editor.id) {
										return item;
									}

									return {
										...item,
										text: editor.text,
										tags: editor.tags,
										links: editor.links,
									};
								}),
							 },
						}
						: book,
					),
			};
		}
		case ActionType.EDITOR_CANCEL: {
			const action = rawAction as EditorCancelAction;

			const editor = state.editors[action.entryId];
			let books = state.books;
			if (editor.deleteOnCancel) {
				const book = books[editor.bookId];

				let bookRoots = book.items.roots;
				let bookEntries = lodash.omit(book.items.entries, [action.entryId]);
				if (editor.parent === undefined) {
					bookRoots = lodash.without(bookRoots, editor.id);
				} else {
					const parentEntry = bookEntries[editor.parent];
					bookEntries = {
						...bookEntries,
						[parentEntry.id]: {
							...parentEntry,
							children: lodash.without(parentEntry.children, editor.id),
						},
					};
				}

				books = {
					...books,
					[editor.bookId]: {
						...book,
						items: {
							...book.items,
							entries: bookEntries,
							roots: bookRoots,
						},
					},
				};
			}

			return {
				...state,
				editors: lodash.omit(state.editors, [action.entryId]),
				books,
			};
		}

		// case ActionType.EDITOR_SET_TEXT:
		// 	const setTextAction = rawAction as EditorSetTextAction;

		// 	return ifEditorId(state, setTextAction.entryId, (itemState) => ({
		// 		...itemState,
		// 		textValue: setTextAction.value,
		// 	}));
		default:
			return state;
	}
}

export function ifEditorId(
	state: EditorMap,
	editorId: string,
	callback: (view: EditorState) => EditorState,
): EditorMap {
	return lodash.mapValues(state, (curEditor) => {
		if (curEditor.id === editorId) {
			return callback(curEditor);
		} else {
			return curEditor;
		}
	});
}
