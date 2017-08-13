import React from "react"; 
import { connect } from "react-redux";

import { ItemState } from "../state/ItemState";
import { RootState } from "../state/RootState";
import { TagState } from "../state/TagState";

import * as AttributeComponent from "./AttributeComponent";
import ListComponent from "./ListComponent";

interface ItemProperty {
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
			? <ListComponent rootNotes={props.childNotes} even={!props.even} />
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
	const note = state.userData.notes[props.id];
	return {
		...note,
		tagsModel: note.tags.map((tagId) => state.userData.tags[tagId]),
		selected: props.id === state.selectedItem,
	};
}

interface StateFromProps extends ItemState {
	tagsModel: TagState[];
	selected: boolean;
}

const component = connect<StateFromProps, void, ItemProperty>(mapStateToProps)(ItemComponent);
export default component;
