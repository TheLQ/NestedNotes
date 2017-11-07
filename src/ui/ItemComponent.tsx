import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { selectItem } from "../redux/reducers/actions/ViewActions";
import { ClientItemState } from "../state/client/ClientViewState";
import { RootState } from "../state/RootState";
import { EditorComponent } from "./EditorComponent";
import { ItemValueComponent } from "./ItemValueComponent";
import { ListComponent } from "./ListComponent";

interface ItemProperty {
	viewId: string;
	id: string;
	even: boolean;
}

interface ItemStateFromProps {
	item: ClientItemState;
	selected: boolean;
	editing: boolean;
}

interface ItemDispatchFromProps {
	onClick(): void;
}

type ItemProps = ItemProperty & ItemStateFromProps & ItemDispatchFromProps;

function ItemComponentRender(props: ItemProps): JSX.Element {
	if (props.editing) {
		return (
			<li>
				<EditorComponent key={props.id} itemId={props.id} />
			</li>
		);
	}

	try {
		const nested = props.item.children.length > 0
			? <ListComponent viewId={props.viewId} rootNotes={props.item.children} even={!props.even} />
			: undefined;

		const onClickHandler = (e: React.FormEvent<HTMLLIElement>) => {
			e.stopPropagation();
			e.preventDefault();
			props.onClick();
		};
		const itemEvenCss = props.even ? "itemEven" : "itemOdd";

		return (
			<li onClick={onClickHandler} className={`${itemEvenCss} item`}>
				<ItemValueComponent item={props.item} selected={props.selected} />
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
		item: note,
		// tagsModel: note.tags.map((tagId) => view.tags.entries[tagId]),
		selected: props.id === view.items.active,
		editing: props.id in state.user.editors,
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
