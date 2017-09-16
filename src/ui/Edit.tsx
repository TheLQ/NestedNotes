import React from "react";

export class EditProperty {
	item: ItemModel;
}

export class EditState {
	textValue: string;
	newValue: string;
	tags: Set<string>;
	newLinks: Set<string>;
	existingLinks: Set<string>;
	deleteOnCancel: boolean;
	newTagText: string;
}

export class EditComponent
extends React.Component<EditProperty, EditState>
implements React.ComponentLifecycle<EditProperty, EditState> {

public constructor(props: EditProperty) {
	super(props);

	this.state = {
		tags: this.props.item.tags,
		existingLinks: new Set(this.props.item.links),
		deleteOnCancel: false,
		newTagText: "",
		...this.parseNewTextValue(this.props.item.text),
	};

	this.onCancel = this.onCancel.bind(this);
	this.onTextEdit = this.onTextEdit.bind(this);
	this.onKeyPress = this.onKeyPress.bind(this);
	this.onSubmit = this.onSubmit.bind(this);
	this.onTagAdd = this.onTagAdd.bind(this);
	this.onTagRemove = this.onTagRemove.bind(this);
	this.onLinkExistingRemove = this.onLinkExistingRemove.bind(this);
	this.onTagNewAdd = this.onTagNewAdd.bind(this);
	this.onTagNewChange = this.onTagNewChange.bind(this);
}

private onSubmit(event: React.FormEvent<HTMLFormElement> | null) {
	// skip when chained from other functions
	if (event !== null) {
		event.preventDefault();
	}

	// save state to props
	const item = this.props.item;

	item.text = this.state.newValue;
	item.tags = new Set(this.state.tags);

	item.links.clear();
	this.state.newLinks.forEach((link) => item.links.add(link));
	this.state.existingLinks.forEach((link) => item.links.add(link));

	// and then cleanup

	changeIsEditing(false);
}

private onCancel(event: React.MouseEvent<HTMLButtonElement>) {
	changeIsEditing(false);
	this.setState((oldState, props: EditProperty) => {
		props.item.delete(ActiveModel.getActiveConfig());
	});
}

private onTextEdit(event: React.FormEvent<HTMLTextAreaElement>) {
	this.setState(this.parseNewTextValue(event.currentTarget.value));
}

private onKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
	event.stopPropagation();
	if (event.shiftKey === true && event.key === "Enter") {
		this.onSubmit(null);
	}
}

private onTagAdd(event: React.FormEvent<HTMLSelectElement>) {
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

private onTagRemove(tag: string) {
	this.setState((oldState: EditState) => {
		oldState.tags.delete(tag);
	});
}

private onTagNewChange(event: React.ChangeEvent<HTMLInputElement>) {
	event.persist();
	this.setState((oldState: EditState) => {
		oldState.newTagText = event.target.value;
	});
}

private onTagNewAdd(event: React.FormEvent<HTMLButtonElement>) {
	event.preventDefault();
	this.setState((oldState: EditState) => {
		oldState.tags.add(oldState.newTagText);
		oldState.newTagText = "";
	});
}

private onLinkExistingRemove(link: string) {
	this.setState((oldState: EditState) => {
		oldState.existingLinks.delete(link);
	});
}

/**
 * Stop parent item's onClick selection listener from running
 * @param event
 */
private blockOnClick(event: React.MouseEvent<HTMLFormElement>) {
	event.stopPropagation();
}

private makeLink(link: string) {
	return <span className="tag">{link}</span>;
}

private parseNewTextValue(newTextValue: string) {
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

private render(): JSX.Element {
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

	const addTagOptions = [...ActiveModel.getActiveConfig().getAllTags(), "Add..."].map(
		(tag) => <option key={tag}>{tag}</option>,
	);

	const removeTagButtons = [...this.state.tags].map((tag) => {
		const onRemoveTag = (e: React.MouseEvent<HTMLButtonElement>) => this.onTagRemove(tag);

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
				<p>
					<label htmlFor="newTag">New: </label>
					<input type="text" value={this.state.newTagText} onChange={this.onTagNewChange} />
					<button onClick={this.onTagNewAdd}>Add New Tag</button>
				</p>
			</fieldset>

			<button id="cancel" type="reset" onClick={this.onCancel}>Cancel</button>
			<input type="submit" value="submit" />
		</form>
	);
}
}

