import React from "react";
import * as Config from "../config";

import * as Edit from "./edit";
import * as EventHandler from "./eventHandlers";
import * as Item from "./item";
import * as List from "./list";

export class Property {
    itemTree: Config.Item;
}

export class State {
    isTextBox: boolean;
    isSelected: boolean;
}

export class Component extends React.Component<Property, State> {
    constructor(props: Property) {
        super(props);
        this.state = {
            isSelected: false,
            isTextBox: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
    }

    render() {
        console.log("item", this.state);
        const item = this.props.itemTree;

        const text = this.state.isTextBox
            ? <Edit.Component itemTree={this.props.itemTree} item={this} />
            : item.text;

        const nestedList = item.nested !== undefined
            ? <List.Component list={item.nested} />
            : null;

        return (
            <li
                onClick={this.onEditItem}
                className={this.state.isSelected ? "item-selected" : "item-init"}
            >
                {text}
                {nestedList}
            </li >
        );

    }

    onEditItem(e: React.MouseEvent<HTMLLIElement>) {
        console.log("onEditItem");
        e.preventDefault();
        e.stopPropagation();

        if (this.state.isTextBox) {
            // sucesfully stopped propagation
            return;
        }

        this.setState((prevState, props) => ({
            isTextBox: true,
        }));
    }
}