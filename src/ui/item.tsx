import React from "react";
import shortid from "shortid";

import * as ActiveRoot from "../model/active";
import {EditComponent} from "./edit";
import * as EventHandler from "./eventHandlers";
import ItemModel from "../model/item";
import * as Item from "./item";
import * as Selection from "./selection";
import * as Attribute from "./attribute";

export class ItemProperty {
	itemId: string;
	even: boolean;
}

export class ItemState {
	isSelected: boolean;
	itemTree: ItemModel;
	isEditing: boolean;
}

type ComponentRefLisener = (removed: boolean, item: ItemComponent) => void;

export class ItemComponent
	extends React.Component<ItemProperty, ItemState>
	implements React.ComponentLifecycle<ItemProperty, ItemState> {

	static componentRefs: Map<string, ItemComponent> = new Map();
	static componentRefListeners: ComponentRefLisener[] = [];

	static forItem(id: string, errorOnNotFound: boolean = true): ItemComponent {
		const value = this.componentRefs.get(id);
		if (errorOnNotFound && value == null) {
			throw new Error("cannot find value " + id);
		}
		return value;
	}

	static renderList(childrenIds: string[], givenEven: boolean): JSX.Element {
		const children = childrenIds.map((childId) => {
			return (
				<ItemComponent
					itemId={childId}
					even={givenEven}
					key={childId}
				/>
			);
		});
		return <ul>{children}</ul>;
	}

	private parent: ItemComponent;

	constructor(props: ItemProperty) {
		super(props);
		this.state = {
			isSelected: false,
			isEditing: false,
			itemTree: ActiveRoot.getActiveConfig().getItem(this.props.itemId),
		};

		// This binding is necessary to make `this` work in the callback
		this.onClickItem = this.onClickItem.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
		this.onClickItem = this.onClickItem.bind(this);
	}

	render() {
		const item = this.state.itemTree;

		if (this.state.isEditing) {
			return (
				<EditComponent item={item} />
			);
		}

		const children = item.children !== undefined
			? ItemComponent.renderList(item.children, !this.props.even)
			: null;
		const tags = item.tags !== undefined
			? [...item.tags].map((curTag: string) => Attribute.newTag(curTag))
			: null;
		const links = item.links !== undefined
			? [...item.links].map((curLink: string) => Attribute.newLink(curLink))
			: null;

		return (
			<li onClick={this.onClickItem} className={this.props.even ? "genericEven" : "genericOdd"}>
				<div className={this.state.isSelected ? "item-selected" : "item-init"}  >
					{tags}{links}{this.state.itemTree.text}
				</div>
				{children}
			</li >
		);
	}

	onClickItem(e: React.MouseEvent<HTMLLIElement>) {
		e.preventDefault();
		e.stopPropagation();
		console.log("onClickItem");

		// if (this.state.isTextBox) {
		// 	// sucesfully stopped propagation
		// 	return;
		// }

		Selection.updateSelection(this.state.itemTree);
	}

	componentDidMount() {
		ItemComponent.componentRefs.set(this.props.itemId, this);
		for (const listener of ItemComponent.componentRefListeners) {
			listener(false, this);
		}
	}

	componentWillUnmount() {
		ItemComponent.componentRefs.delete(this.props.itemId);
		for (const listener of ItemComponent.componentRefListeners) {
			listener(true, this);
		}
	}
}
