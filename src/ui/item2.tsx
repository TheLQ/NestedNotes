import React from "react"; 
import { connect } from "react-redux";

import { RootState } from "../state/root";
import { ItemState } from "../state/item";
import { TagState } from "../state/tag";

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
	try {
		const nested = props.childNotes.length > 0
			? <List rootNotes={props.childNotes} even={!props.even} />
			: null;
		const tags = props.tagsModel.length > 0
			? [...props.tagsModel].map((curTag: TagState) => Attribute.newTag(curTag.name))
			: null;
		const links = props.links.length > 0
			? [...props.links].map((curLink: string) => Attribute.newLink(curLink))
			: null;

		const onClickHandler = (e: React.FormEvent<HTMLLIElement>) => {
			onClickItem(props.id);
		};
		const selected = false /*props.selected*/ ? "item-selected" : "item-init";
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
	};
}

interface StateFromProps extends ItemState {
	tagsModel: TagState[];
}

const component = connect<StateFromProps, void, ItemProperty>(mapStateToProps)(ItemComponent);
export default component;
