"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";

class ListProperty {
    list: Config.Item[];
}

class ListState {
}

class ListReact extends React.Component<ListProperty, ListState> {
    constructor(props: ListProperty) {
        super(props);
    }

    render(): JSX.Element {
        const list = this.props.list;
        console.log("list", list);

        const nestedItems = list.map((nestedItem) =>
            <ItemReact key={nestedItem.id} itemTree={nestedItem} />,
        );
        return (
            <ul>
                {nestedItems}
            </ul>
        );
    }
}

class ItemProperty {
    itemTree: Config.Item;
}

class ItemState {
    isTextBox: boolean;
}

class ItemReact extends React.Component<ItemProperty, ItemState> {
    constructor(props: ItemProperty) {
        super(props);
        this.state = {
            isTextBox: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
    }

    render() {
        console.log("item", this.state);
        const item = this.props.itemTree;

        const text = this.state.isTextBox
            ? <EditReact itemTree={this.props.itemTree} item={this} />
            : item.text;
        const nestedList = item.nested !== undefined
            ? <ListReact list={item.nested} />
            : null;
        return (
            <li onClick={this.onEditItem}>
                {text}
                {nestedList}
            </li>
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

class EditProperty {
    item: ItemReact;
    itemTree: Config.Item;
}

class EditState {
    itemTree: Config.Item;

    textValue: string | null;
}

class EditReact extends React.Component<EditProperty, EditState> {
    constructor(props: EditProperty) {
        super(props);
        this.state = {
            itemTree: props.itemTree,
            textValue: null,
        };

        // This binding is necessary to make `this` work in the callback
        this.onKey = this.onKey.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const item = this.props.itemTree;
        return (
            <textarea
                cols={50}
                rows={1}
                defaultValue={item.text}
                onKeyPress={this.onKey}
                onChange={this.handleChange}
            />
        );
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textValue: event.target.value });
    }

    onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.charCode !== 13) {
            return;
        }

        const test = this.state.textValue;
        this.setState({
            textValue: null,
        });
        this.props.item.setState((oldState: ItemState, props: ItemProperty) => {
            props.itemTree.text = test as string;
            console.log(Config.example);
            return {
                isTextBox: false,
            };
        });
    }
}

ReactDOM.render(<ListReact list={Config.example.notes} />, document.getElementById("replaceMe"));
