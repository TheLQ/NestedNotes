import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/RootState";
import { ItemState } from "../state/user/ItemState";
import { TagState } from "../state/user/TagState";

import * as AttributeComponent from "./AttributeComponent";
import ListComponent from "./ListComponent";

interface ItemProperty {
	viewId: string;
	id: string;
	even: boolean;
}

function onClickItem(id: string) {
	// TODO: uhh...
	// Selection.updateSelection(this.state.itemTree);
}

function ItemComponent(props: ItemProperty & StateFromProps): JSX.Element {
	try {
		const nested = props.childNotes.length > 0
			? <ListComponent viewId={props.viewId} rootNotes={props.childNotes} even={!props.even} />
			: null;
		const tags = props.tagsModel.length > 0
			? [...props.tagsModel].map((curTag: TagState) => AttributeComponent.newTag(curTag.name))
			: null;
		const links = props.links.length > 0
			? [...props.links].map((curLink: string) => AttributeComponent.newLink(curLink))
			: null;

		const onClickHandler = (e: React.FormEvent<HTMLLIElement>) => {
			onClickItem(props.id);
		};
		const selected = props.selected ? "item-selected" : "item-init";
		return (
			<li onClick={onClickHandler} className={(props.even ? "itemEven" : "itemOdd") + " item"}>
				<div className={selected}>
					{tags}{links}{props.text}
				</div>
				{nested}
			</li>
		);
	} catch (error) {
		console.log("failed on item", props);
		throw error;
	}

}

function mapStateToProps(state: RootState, props: ItemProperty): StateFromProps {
	const view = state.client.views.entries[props.viewId];
	const note = view.items.entries[props.id];
	return {
		...note,
		tagsModel: note.tags.map((tagId) => view.tags.entries[tagId]),
		selected: props.id === view.items.active,
	};
}

interface StateFromProps extends ItemState {
	tagsModel: TagState[];
	selected: boolean;
}

const component = connect<StateFromProps, void, ItemProperty>(mapStateToProps)(ItemComponent);
export default component;
