import commonmark from "commonmark";
import React from "react";

import * as Config from "../config";
import * as Selection from "./selection";

import * as Item from "./item";

export class Property {
	item: Config.Item;
}

export class State {
	newValue: string;
	tags: string[];
}

export class Component extends React.Component<Property, State> {
	nestedComponents: Item.Component[] = [];

	constructor(props: Property) {
		super(props);

		this.state = {
			newValue: this.props.item.text,
			tags: this.props.item.tags,
		};

		this.onTextEdit = this.onTextEdit.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onTagAdd = this.onTagAdd.bind(this);
	}

	onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// do stuff with data
		this.props.item.text = this.state.newValue;
		this.props.item.tags = this.state.tags;
		Config.saveActiveConfig();

		// and then cleanup

		changeIsEditing(false);
	}

	onTextEdit(event: React.FormEvent<HTMLTextAreaElement>) {
		this.setState({
			newValue: event.currentTarget.value,
		});
	}

	onTagAdd(event: React.FormEvent<HTMLSelectElement>) {
		this.setState((oldState: State) => {
			oldState.tags.push(
				event.currentTarget.options[event.currentTarget.selectedIndex].value,
			);
		});
	}

	onTagRemove(tag: string) {
		this.setState((oldState: State) => {
			oldState.tags.splice(oldState.tags.indexOf(tag), 1);
		});
	}

	/**
	 * Stop parent item's onClick selection listener from running
	 * @param event
	 */
	blockOnClick(event: React.MouseEvent<HTMLFormElement>) {
		event.stopPropagation();
	}

	render(): JSX.Element {
		const addTagOptions = Config.getAllTags().map(
			(tag) => <option key={tag}>{tag}</option>,
		);

		const removeTagButtons = this.state.tags.map((tag) => (
			<button id="removeTag" className="tag" onClick={(e) => this.onTagRemove(tag)} key={tag}>
				{tag}
			</button>
		));

		return (
			<form onSubmit={this.onSubmit} onClick={this.blockOnClick} className="item-selected">
				<fieldset>
					<legend>Edit Text</legend>
					<input type="checkbox" id="bulkAdd" name="bulkAdd" />
					<label htmlFor="bulkAdd">Bulk Add Mode</label>

					<br />
					<textarea rows={20} cols={80} value={this.state.newValue} onChange={this.onTextEdit} />
					<label htmlFor="renderedEdit">Rendered</label>
					<p id="renderedEdit">{this.state.newValue}</p>
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
	const activeReact = Selection.getActiveSelection().reactComponent;
	if (activeReact != null) {
		activeReact.setState({
			isEditing: to,
		});
	}
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
	console.log("e", e);
	if (e.charCode === "e".charCodeAt(0)) {
		console.log("yay");
		changeIsEditing(true);
	}
});
