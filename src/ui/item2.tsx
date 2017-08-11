import React from "react"; 
import { connect } from "react-redux";

import { AppDataModel } from "../model/appData";
import { ItemModel } from "../model/item";
import { TagModel } from "../model/tag";

import * as Attribute from "./attribute";
import List from "./list";

interface ItemProperty {
	id: string;
	even: boolean;
}

function onClickItem(id: string) {
	// TODO: uhh...
	// Selection.updateSelection(this.state.itemTree);
}

function ItemComponent(props: ItemProperty & StateFromProps): JSX.Element {
	const nested = props.childNotes.length > 0
		? <List rootNotes={props.childNotes} even={!props.even} />
		: null;
	const tags = props.tagsModel.length > 0
		? [...props.tagsModel].map((curTag: TagModel) => Attribute.newTag(curTag.name))
		: null;
	const links = props.links.length > 0
		? [...props.links].map((curLink: string) => Attribute.newLink(curLink))
		: null;

	const onClickHandler = (e: React.FormEvent<HTMLLIElement>) => {
		onClickItem(props.id);
	};

	return (
		<li onClick={onClickHandler} className={(props.even ? "itemEven" : "itemOdd") + " item"}>
			<div className={props.selected ? "item-selected" : "item-init"}  >
				{tags}{links}{props.text}
			</div>
			{nested}
		</li>
	);
}

function mapStateToProps(state: AppDataModel, props: ItemProperty): StateFromProps {
	const note = state.userData.notes[props.id];
	return {
		...note,
		tagsModel: note.tags.map((tagId) => state.userData.tags[tagId]),
	};
}

interface StateFromProps extends ItemModel {
	tagsModel: TagModel[];
}

const component = connect<StateFromProps, void, ItemProperty>(mapStateToProps)(ItemComponent);
export default component;
