import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import * as EditorActions from "../redux/reducers/actions/EditorActions";
import { RootState } from "../state/RootState";
import { getAllTags } from "../state/tools";
import { EditorState } from "../state/user/EditorState";
import { ItemValueComponent } from "./ItemValueComponent";

const EDITOR_TEXT_COLUMNS = 80;
const EDITOR_TEXT_ROWS = 20;

interface EditorProperty {
	itemId: string;
}

interface EditorStateProps extends EditorState {
	allTags: string[];
}

interface EditorDispatchProps {
	setText(text: string): void;
	setTextRaw(text: string): void;
	addTag(tag: string): void;
	removeTag(tag: string): void;
	setTags(tags: string[]): void;
	addLink(link: string): void;
	removeLink(link: string): void;
	setLinks(link: string[]): void;
	submit(): void;
	cancel(): void;
}

function blockOnClick(event: React.MouseEvent<HTMLFormElement>) {
	event.stopPropagation();
}

function parseText(input: string) {
	const newLinks: Set<string> = new Set();
	const newTags: Set<string> = new Set();

	for (const urlPrefix of ["http://", "https://", "#"]) {
		// console.log("prefix " + urlPrefix);
		let start = 0;
		while (true) {
			// const origStart = start;
			start = input.indexOf(urlPrefix, start);
			// console.log("for string '" + input + "' from " + origStart + " found start " + start);
			if (start === -1) {
				break;
			}

			let end = input.indexOf(" ", start);
			if (end === -1) {
				end = input.indexOf("\n", start);
				if (end === -1) {
					end = input.length;
				}
			}
			// console.log("found end " + end);

			const part = input.substr(start, end - start);

			if (part.charAt(0) === "#") {
				const tag = part.substr(1);
				newTags.add(tag);
			} else {
				newLinks.add(part);
			}

			// console.log("found link '" + link + "'");

			input = input.substr(0, start) + input.substr(end + 1);
			// start = ;
			// console.log("new input '" + input + "'");
		}
	}

	return {
		result: input.trim(),
		links: Array.from(newLinks),
		tags: Array.from(newTags),
	};
}

function onTextChange(props: EditorDispatchProps, value: string) {
	props.setTextRaw(value);

	const parseData = parseText(value);
	props.setLinks(parseData.links);
	props.setTags(parseData.tags);
	props.setText(parseData.result);
}

function EditComponentRender(
	props: EditorProperty & EditorStateProps & EditorDispatchProps,
): JSX.Element {
	const addTagOptions = props.allTags
		.filter((tag) => props.tags.indexOf(tag) === -1)
		.map(
			(tag) => <option key={tag}>{tag}</option>,
		);

	const addTag = (event: React.ChangeEvent<HTMLSelectElement>) => {
		let text = props.textRaw;
		const tagToAdd = "#" + event.target.value;

		let lastTagPos = text.lastIndexOf(" #");
		if (lastTagPos === -1 && text.startsWith("#")) {
			lastTagPos = 0;
		}
		if (lastTagPos !== -1) {
			// insert after tag
			const spaceAfterTag = text.indexOf(" ", lastTagPos);
			if (spaceAfterTag !== -1) {
				text = text.substr(0, spaceAfterTag)
					+ " " + tagToAdd + " "
					+ text.substr(spaceAfterTag + 1);
			} else {
				// tag is at end of text
				text = text + " " + tagToAdd;
			}
		} else {
			// no existing tags
			text = tagToAdd + " " + text;
		}

		onTextChange(props, text);
	};

	const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		event.stopPropagation();
		if (event.shiftKey === true && event.key === "Enter") {
			props.submit();
		}
	};

	const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const userValue = event.target.value;
		onTextChange(props, userValue);
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		props.submit();
	};

	return (
		<form onSubmit={onSubmit} onClick={blockOnClick} className="item-selected">
			<fieldset>
				<legend>Edit Text</legend>
				<div>
					<label><input type="checkbox" id="bulkAdd" name="bulkAdd" /> Bulk Add Mode</label>
				</div>
				<textarea
					rows={EDITOR_TEXT_ROWS}
					cols={EDITOR_TEXT_COLUMNS}
					value={props.textRaw}
					onKeyPress={onKeyPress}
					onChange={onChange}
					autoFocus={true}
				/>
				<p>
					<label htmlFor="addTags">Add Tag: </label>
					<select id="addTags" onChange={addTag}>{addTagOptions}</select>
				</p>
			</fieldset>
			<fieldset>
				<legend>Preview</legend>

				<ItemValueComponent item={props} selected={false} />
			</fieldset>

			<button id="cancel" type="reset" onClick={props.cancel}>Cancel</button>
			<input type="submit" value="submit" />
		</form>
	);
}

function mapStateToProps(state: RootState, props?: EditorProperty): EditorStateProps {
	if (props === undefined) {
		throw new Error("no props");
	}

	const editor = state.user.editors[props.itemId];

	return {
		...editor,
		// todo
		allTags: getAllTags(state.user.books[editor.bookId]),
	};
}

function mapDispatchToProps(
	dispatch: Dispatch</*Action*/{}>,
	ownProps?: EditorProperty,
): EditorDispatchProps {
	if (ownProps === undefined) {
		throw new Error("no props");
	}

	return {
			setText(text: string) {
				dispatch(EditorActions.setText(ownProps.itemId, text));
			},
			setTextRaw(text: string) {
				dispatch(EditorActions.setTextRaw(ownProps.itemId, text));
			},
			addTag(tag: string) {
				dispatch(EditorActions.addTag(ownProps.itemId, tag));
			},
			removeTag(tag: string) {
				dispatch(EditorActions.removeTag(ownProps.itemId, tag));
			},
			setTags(tags: string[]) {
				dispatch(EditorActions.setTags(ownProps.itemId, tags));
			},
			addLink(link: string) {
				dispatch(EditorActions.addLink(ownProps.itemId, link));
			},
			removeLink(link: string) {
				dispatch(EditorActions.removeLink(ownProps.itemId, link));
			},
			setLinks(link: string[]) {
				dispatch(EditorActions.setLinks(ownProps.itemId, link));
			},
			submit() {
				dispatch(EditorActions.submit(ownProps.itemId));
			},
			cancel() {
				dispatch(EditorActions.cancel(ownProps.itemId));
			},
		};
}

export const EditorComponent = connect<
	EditorStateProps,
	EditorDispatchProps,
	EditorProperty
>(mapStateToProps, mapDispatchToProps)(EditComponentRender);
