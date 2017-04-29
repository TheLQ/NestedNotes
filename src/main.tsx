"use strict"

// import jquery from 'jquery';
// import * as h from './utils';
import React from 'react';
import ReactDOM from 'react-dom';

import * as Config from './config'

class ListProperty {
    list: Array<Config.Item>
}

class ListState {
    list: Array<Config.Item>
}

class List extends React.Component<ListProperty, ListState> {
    constructor(props: ListState/*lol*/) {
        super(props);
        this.state = {
            list: props.list
        }
    }

    render(): JSX.Element {
        let list = this.state.list;
        console.log("list", list);

        const nestedItems = list.map((nestedItem) =>
            <ItemReact key={nestedItem.id} itemTree={nestedItem} />
        );
        return (
            <ul>
                {nestedItems}
            </ul>
        )
    }
}

class ItemProperty {
    itemTree: Config.Item;
}

class ItemState {
    itemTree: Config.Item;
    isTextBox: boolean;
}

class ItemReact extends React.Component<ItemProperty, ItemState> {
    textArea: JSX.Element;

    constructor(props: ItemProperty) {
        super(props);
        this.state = {
            itemTree: props.itemTree,
            isTextBox: false
        };

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
        this.onKey = this.onKey.bind(this);
    }

    render() {
        console.log("item", this.state);
        let item = this.state.itemTree;
        let nestedList = item.nested !== undefined
            ? <List list={item.nested} />
            : null;
        if (this.state.isTextBox) {
            this.textArea = <textarea cols={50} rows={1} defaultValue={item.text} onKeyPress={this.onKey}></textarea>

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
            //sucesfully stopped propagation
            return;
        }

        this.setState((prevState, props) => ({
            isTextBox: !prevState.isTextBox
        }))
    }

    onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        console.log(e.charCode)
    }
}

ReactDOM.render(<List list={Config.example.notes} />, document.getElementById('replaceMe'));