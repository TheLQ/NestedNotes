import React from "react";
import shortid from "shortid";

import * as Config from "../config";
import {EditComponent as EditComponent} from "./edit";
import * as EventHandler from "./eventHandlers";
import * as Item from "./item";
import * as Selection from "./selection";

export class ItemProperty {
	itemId: string;
	even: boolean;
}

export class ItemState {
	isSelected: boolean;
	itemTree: Config.Item;
	isEditing: boolean;
}

export class ItemComponent extends React.Component<ItemProperty, ItemState> {
	static componentRefs: Map<string, ItemComponent> = new Map();
	// static newComponent(givenTree: Config.Item, givenEven: boolean, parent: Component): JSX.Element {
	// 	if (givenTree.id == null) {
	// 		givenTree.id = shortid.generate();
	// 	}
	// 	const refHandle = (jsxComponent: Component) => {
	// 		if (jsxComponent == null) {
	// 			this.componentRefs.delete(givenTree.id);
	// 		} else {
	// 			this.componentRefs.set(givenTree.id, jsxComponent);
	// 		}
	// 	};
	// 	return (
	// 		<Component
	// 			itemId={givenTree.id}
	// 			even={givenEven}
	// 			key={givenTree.id}
	// 			ref={refHandle}
	// 		/>
	// 	);
	// }

	static forItem(id: string): ItemComponent {
		const value = this.componentRefs.get(id);
		if (value == null) {
			throw new Error("cannot find value " + id);
		}
		return value;
	}

	static renderList(childrenIds: string[], givenEven: boolean): JSX.Element {
		const children = childrenIds.map((childId) => {
			const refHandle = (jsxComponent: ItemComponent) => {
				if (jsxComponent == null) {
					this.componentRefs.delete(childId);
				} else {
					this.componentRefs.set(childId, jsxComponent);
				}
			};
			return (
				<ItemComponent
					itemId={childId}
					even={givenEven}
					key={childId}
					ref={refHandle}
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
			itemTree: Config.getItem(this.props.itemId),
		};

		// This binding is necessary to make `this` work in the callback
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
			? [...item.tags].map((curTag: string) => (<span className="tag" key={curTag}>{curTag}</span>))
			: null;
		const links = item.links !== undefined
			? [...item.links].map((curLink: string) => (<span className="link" key={curLink}>{curLink}</span>))
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
}
