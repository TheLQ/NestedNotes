import React from "react";
import * as Config from "../config";

import * as ItemEdit from "./itemEdit";
import * as EventHandler from "./eventHandlers";
import * as Item from "./item";
import * as List from "./list";
import * as Selection from "./selection";
import * as Edit from "./edit";

export class Property {
    itemTree: Config.Item;
    even: boolean;
}

export class State {
    isTextBox: boolean;
    isSelected: boolean;
    isEditing: boolean;
}

export class Component extends React.Component<Property, State> {
    constructor(props: Property) {
        super(props);
        this.state = {
            isSelected: false,
            isTextBox: false,
            isEditing: false
        };

        this.props.itemTree.reactComponent = this;

        // This binding is necessary to make `this` work in the callback
        this.onClickItem = this.onClickItem.bind(this);
    }

    render() {
    //     console.log("item", this.state);
        if (this.state.isEditing) {
            return (
                <Edit.Component item={this.props.itemTree} />
            )
        }
        const item = this.props.itemTree;

        const text = this.state.isTextBox
            ? <ItemEdit.Component itemTree={this.props.itemTree} item={this} />
            : item.text;

        const nestedList = item.nested !== undefined
            ? <List.Component list={item.nested} even={!this.props.even} />
            : null;
        
        const tags = item.tags !== undefined
            ? item.tags.map((curTag, i) => (<span className="tag" key={curTag}>{curTag}</span>))
            : null;

        return (
            <li onClick={this.onClickItem} className={this.props.even ? "genericEven" : "genericOdd"}>
                <div className={this.state.isSelected ? "item-selected" : "item-init"}  >
                    {tags}{text}
                </div>
                {nestedList}
            </li >
        );

    }

    onClickItem(e: React.MouseEvent<HTMLLIElement>) {
        e.preventDefault();
        e.stopPropagation();
        console.log("onClickItem");

        if (this.state.isTextBox) {
            // sucesfully stopped propagation
            return;
        }

        Selection.updateSelection(this.props.itemTree);
    }
}

document.addEventListener("keypress", function newItemKeyPressListener(e: KeyboardEvent) {
    if (e.charCode === EventHandler.KEY_ENTER) {
        
    }
});