"use strict";

import React from "react";
import ReactDOM from "react-dom";

import * as Config from "./config";

class ListProperty {
    list: Config.Item[];
}

class ListState {
    list: Config.Item[];
}

class List extends React.Component<ListProperty, ListState> {
    constructor(props: ListProperty) {
        super(props);
        this.state = {
            list: props.list,
        };
    }

    render(): JSX.Element {
        const list = this.state.list;
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
    itemTree: Config.Item;
    isTextBox: boolean;
    textValue: string | null;
}

class ItemReact extends React.Component<ItemProperty, ItemState> {
    textArea: JSX.Element;
    itemTree: Config.Item;

    constructor(props: ItemProperty) {
        super(props);
        this.state = {
            itemTree: props.itemTree,
            isTextBox: false,
            textValue: null,
        };

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
        this.onKey = this.onKey.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        console.log("item", this.state);
        const item = this.state.itemTree;
        const nestedList = item.nested !== undefined
            ? <List list={item.nested} />
            : null;
        if (this.state.isTextBox) {
            this.textArea = (
                <textarea
                    cols={50}
                    rows={1}
                    defaultValue={item.text}
                    onKeyPress={this.onKey}
                    onChange={this.handleChange}
                />
            );

            return (
                <li onClick={this.onEditItem}>
                    {this.textArea}
                    {nestedList}
                </li>
            );
        } else {
            return (
                <li onClick={this.onEditItem}>
                    {item.text}
                    {nestedList}
                </li>
            );
        }

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

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textValue: event.target.value });
    }

    onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.charCode !== 13) {
            return;
        }

        this.setState((oldState: ItemState) => {
            oldState.itemTree.text = oldState.textValue as string;
            console.log(Config.example);
            return {
                isTextBox: false,
            };
        });
    }
}

ReactDOM.render(<List list={Config.example.notes} />, document.getElementById("replaceMe"));
