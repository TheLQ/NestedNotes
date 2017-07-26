import commonmark from "commonmark";
import React from "react";
import { v4 as uuid} from "uuid";

import * as Config from "../config";

import * as Attribute from "./attribute";
import {ItemComponent as ItemComponent} from "./item";
import * as Selection from "./selection";

export class EditProperty {
	item: Config.Item;
}

export class EditState {
	textValue: string;
	newValue: string;
	tags: Set<string>;
	newLinks: Set<string>;
	existingLinks: Set<string>;
}

export class EditComponent extends React.Component<EditProperty, EditState> {
	nestedComponents: ItemComponent[] = [];

	constructor(props: EditProperty) {
		super(props);

		this.state = {
			tags: this.props.item.tags,
			existingLinks: this.props.item.links,
			...this.parseNewTextValue(this.props.item.text),
		};

		this.onTextEdit = this.onTextEdit.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
		this.onTagRemove = this.onTagRemove.bind(this);
		this.onLinkExistingRemove = this.onLinkExistingRemove.bind(this);
	}

	onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// save state to props

		this.props.item.text = this.state.newValue;
		this.props.item.tags = new Set(this.state.tags);

		const allLinks: Set<string> = new Set();
		this.state.newLinks.forEach((link) => allLinks.add(link));
		this.state.existingLinks.forEach((link) => allLinks.add(link));
		// this.props.item.links = this.state.links || [];
		this.props.item.links = allLinks;

		Config.saveActiveConfig();

		// and then cleanup

		changeIsEditing(false);
	}

	onTextEdit(event: React.FormEvent<HTMLTextAreaElement>) {
		this.setState(this.parseNewTextValue(event.currentTarget.value));
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
					return (
						<Attribute.AttributeComponent
							type={Attribute.AttributeType.Link}
							new={true}
							value={link}
							key={"new-" + link}
						/>
					);
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
					<textarea rows={20} cols={80} value={this.state.textValue} onChange={this.onTextEdit} />
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

const uuidDomain = "net.thelq.pro";
function newItemId() {
	// uuid();
}

function insertNested() {
	const active = Selection.getActiveSelection();
	console.log("active", active);
	const parent = Config.getItem(active.parentId);


}

document.addEventListener("keypress", function editKeyPressListener(e: KeyboardEvent) {
	if (e.charCode === "e".charCodeAt(0)) {
		changeIsEditing(true);
	} else if (e.charCode === "s".charCodeAt(0)) {
		insertNested();
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
