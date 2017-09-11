import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { selectItem } from "../redux/reducers/actions/ViewActions";
import { RootState } from "../state/RootState";
import { ItemState } from "../state/user/ItemState";
import { TagState } from "../state/user/TagState";
import * as AttributeComponent from "./AttributeComponent";
import { ListComponent } from "./ListComponent";

interface ItemProperty {
	viewId: string;
	id: string;
	even: boolean;
}

interface ItemStateFromProps extends ItemState {
	tagsModel: TagState[];
	selected: boolean;
}

interface ItemDispatchFromProps {
	onClick(): void;
}

type ItemProps = ItemProperty & ItemStateFromProps & ItemDispatchFromProps;

function ItemComponentRender(props: ItemProps): JSX.Element {
	try {
		const nested = props.childNotes.length > 0
			? <ListComponent viewId={props.viewId} rootNotes={props.childNotes} even={!props.even} />
			: undefined;
		const tags = props.tagsModel.length > 0
			? [...props.tagsModel].map((curTag: TagState) => AttributeComponent.newTag(curTag.name))
			: undefined;
		const links = props.links.length > 0
			? [...props.links].map((curLink: string) => AttributeComponent.newLink(curLink))
			: undefined;

		const onClickHandler = (e: React.FormEvent<HTMLLIElement>) => {
			e.stopPropagation();
			e.preventDefault();
			props.onClick();
		};
		const itemEvenCss = props.even ? "itemEven" : "itemOdd";
		const selected = props.selected ? "item-selected" : "item-init";

		return (
			<li onClick={onClickHandler} className={`${itemEvenCss} item`}>
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

function mapStateToProps(state: RootState, props: ItemProperty): ItemStateFromProps {
	const view = state.client.views.entries[props.viewId];
	const note = view.items.entries[props.id];

	return {
		...note,
		tagsModel: note.tags.map((tagId) => view.tags.entries[tagId]),
		selected: props.id === view.items.active,
	};
}

function mapDispatchToProps(
	dispatch: Dispatch</*Action*/{}>,
	ownProps: ItemProperty,
): ItemDispatchFromProps {
	return {
		onClick: () => {
			dispatch(selectItem(ownProps.viewId, ownProps.id));
		},
	};
}

export const ItemComponent = connect<
	ItemStateFromProps,
	ItemDispatchFromProps,
	ItemProperty
>(mapStateToProps, mapDispatchToProps)(ItemComponentRender);
