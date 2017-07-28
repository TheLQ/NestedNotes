import commonmark from "commonmark";
import React from "react";

import * as Config from "../config";

import * as Attribute from "./attribute";
import * as Selection from "./selection";
import {ItemComponent, ItemState} from "./item";

export class EditProperty {
	item: Config.Item;
}

export class EditState {
	textValue: string;
	newValue: string;
	tags: Set<string>;
	newLinks: Set<string>;
	existingLinks: Set<string>;
	deleteOnCancel: boolean;
}

export class EditComponent
	extends React.Component<EditProperty, EditState>
	implements React.ComponentLifecycle<EditProperty, EditState> {

	nestedComponents: ItemComponent[] = [];
	private firstRun: boolean;

	constructor(props: EditProperty) {
		super(props);

		this.state = {
			tags: this.props.item.tags,
			existingLinks: new Set(this.props.item.links),
			deleteOnCancel: false,
			...this.parseNewTextValue(this.props.item.text),
		};

		this.onCancel = this.onCancel.bind(this);
		this.onTextEdit = this.onTextEdit.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
		this.onTagRemove = this.onTagRemove.bind(this);
		this.onLinkExistingRemove = this.onLinkExistingRemove.bind(this);
	}

	onSubmit(event: React.FormEvent<HTMLFormElement> | null) {
		// skip when chained from other functions
		if (event != null) {
			event.preventDefault();
		}

		// save state to props
		const item = this.props.item;

		item.text = this.state.newValue;
		item.tags = new Set(this.state.tags);

		item.links.clear();
		this.state.newLinks.forEach((link) => item.links.add(link));
		this.state.existingLinks.forEach((link) => item.links.add(link));

		Config.saveActiveConfig();

		// and then cleanup

		changeIsEditing(false);
	}

	onCancel(event: React.MouseEvent<HTMLButtonElement> ) {
		changeIsEditing(false);
		this.setState((oldState, props: EditProperty) => {
			props.item.delete(Config.getActiveConfig());
		});
	}

	onTextEdit(event: React.FormEvent<HTMLTextAreaElement>) {
		this.setState(this.parseNewTextValue(event.currentTarget.value));
	}

	onKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		event.stopPropagation();
		if (event.shiftKey === true && event.key === "Enter") {
			this.onSubmit(null);
		}
	}

	onTagAdd(event: React.FormEvent<HTMLSelectElement>) {
		const tagToAdd = event.currentTarget.value;
		if (this.state.tags.has(tagToAdd)) {
			return;
		}
		this.setState((state: EditState) => {
			state.tags.add(
				tagToAdd,
				// event.currentTarget.options[event.currentTarget.selectedIndex].value,
			);
		});
	}

	onTagRemove(tag: string) {
		this.setState((oldState: EditState) => {
			oldState.tags.delete(tag);
		});
	}

	onLinkExistingRemove(link: string) {
		this.setState((oldState: EditState) => {
			oldState.existingLinks.delete(link);
		});
	}

	/**
	 * Stop parent item's onClick selection listener from running
	 * @param event
	 */
	blockOnClick(event: React.MouseEvent<HTMLFormElement>) {
		event.stopPropagation();
	}

	makeLink(link: string) {
		return <span className="tag">{link}</span>;
	}

	parseNewTextValue(newTextValue: string) {
		if (newTextValue == null || newTextValue === "") {
			return {
				textValue: newTextValue,
				newValue: newTextValue,
				newLinks: new Set(),
			};
		}
		const parsed = parseLinks(newTextValue);
		return {
			textValue: newTextValue,
			newValue: parsed.result,
			newLinks: parsed.links,
		};
	}

	render(): JSX.Element {
		const links = [...this.state.existingLinks].concat([...this.state.newLinks])
			.sort()
			.map((link) => {
				if (this.state.newLinks.has(link)) {
					return Attribute.newLink(link);
				} else {
					const onRemoveLink = (e: any) => this.onLinkExistingRemove(link);
					return (
						<button
							id="removeLink"
							className="link"
							onClick={onRemoveLink}
							key={"existing-" + link}
						>
							{link}
						</button>
					);
				}
			});

		const addTagOptions = Config.getAllTags().map(
			(tag) => <option key={tag}>{tag}</option>,
		);

		const removeTagButtons = [...this.state.tags].map((tag) => {
			const onRemoveTag = (e: any) => this.onTagRemove(tag);
			return (
				<button id="removeTag" className="tag" onClick={onRemoveTag} key={tag}>
					{tag}
				</button>
			);
		});

		return (
			<form onSubmit={this.onSubmit} onClick={this.blockOnClick} className="item-selected">
				<fieldset>
					<legend>Edit Text</legend>
					<div>
						<label><input type="checkbox" id="bulkAdd" name="bulkAdd" /> Bulk Add Mode</label>
					</div>
					<textarea
						rows={20}
						cols={80}
						value={this.state.textValue}
						onChange={this.onTextEdit}
						onKeyPress={this.onKeyPress}
						autoFocus
					/>
					<div>
						{links}{this.state.newValue}
					</div>
				</fieldset>
				<fieldset>
					<legend>Tags</legend>
					<p>
						<label htmlFor="removeTag">Tags:</label>
						{removeTagButtons}
					</p>
					<p>
						<label htmlFor="addTags">Add: </label>
						<select id="addTags" onChange={this.onTagAdd}>{addTagOptions}</select>
					</p>
				</fieldset>

				<button id="cancel" type="reset" onClick={this.onCancel}>Cancel</button>
				<input type="submit" value="submit" />
			</form>
		);
	}
}

function changeIsEditing(to: boolean) {
	// console.log("changed to ", to);
	const activeReact = ItemComponent.forItem(Selection.getActiveSelection().id);
	if (activeReact != null) {
		activeReact.setState({
			isEditing: to,
		});
	}
}

document.addEventListener("keyup", function editKeyPressListener(e: KeyboardEvent) {
	if (e.key === "e") {
		changeIsEditing(true);
	}
});

function parseLinks(input: string) {
	const newLinks: Set<string> = new Set();
	let counter = 0;
	for (const urlPrefix of ["http://", "https://"]) {
		// console.log("prefix " + urlPrefix);
		let start = 0;
		while (true) {
			if (++counter === 10) {
				throw new Error("oops");
			}
			const origStart = start;
			start = input.indexOf(urlPrefix, start);
			// console.log("for string '" + input + "' from " + origStart + " found start " + start);
			if (start === -1) {
				break;
			}

			let end = input.indexOf(" ", start);
			if (end === -1) {
				end = input.length;
			}
			// console.log("found end " + end);

			const link = input.substr(start, end - start);
			newLinks.add(link);
			// console.log("found link '" + link + "'");

			input = input.substr(0, start) + input.substr(end + 1);
			// start = ;
			// console.log("new input '" + input + "'");
		}
	}

	return {
		result: input,
		links: newLinks,
	};
}
