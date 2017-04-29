"use strict"

// import jquery from 'jquery';
// import * as h from './utils';
import React from 'react';
import ReactDOM from 'react-dom';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list
        }
    }

    render() {
        let list = this.state.list;
        console.log("list", list);

        const nestedItems = list.map((nestedItem) =>
            <ListItem key={nestedItem.id} itemTree={nestedItem} />
        );
        return (
            <ul>
                {nestedItems}
            </ul>
        )
    }
}

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemTree: props.itemTree,
            isTextBox: false,
            textArea: null
        }

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
        this.onKey = this.onKey.bind(this);
    }

    render() {
        console.log("item", this.state);
        let item = this.state.itemTree;
        let nestedList = "nested" in item
            ? <List list={item.nested} />
            : null;
        if (this.state.isTextBox) {
            this.state.textArea = <textarea cols="50" rows="1" defaultValue={item.text} onKeyPress={this.onKey}></textarea>

            return (
                <li onClick={this.onEditItem}>
                    {this.state.textArea}
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

    onEditItem(e/*: MouseEvent*/) {
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

    onKey(e/*: keyup*/) {
        console.log(e.charCode)
    }
}

var example = {
    "config": {
        "name": "myFirstTime"
    },
    "notes": [
        {
            "id": "1",
            "settings": {},
            "text": "level 1",
            "nested": [
                {
                    "id": "2",
                    "settings": {},
                    "text": "level 1.1"
                },
                {
                    "id": "3",
                    "settings": {},
                    "text": "level 1.2"
                }
            ]
        },
        {
            "id": 4,
            "settings": {},
            "text": "level 2",
            "nested": [
                {
                    "id": 5,
                    "settings": {},
                    "text": "level 2.1",
                    "nested": [
                        {
                            "id": 6,
                            "settings": {},
                            "text": "level 2.1.1"
                        }
                    ]
                },
                {
                    "id": 7,
                    "settings": {},
                    "text": "level 2.2"
                }

            ]
        }
    ]
}

ReactDOM.render(<List list={example.notes} />, document.getElementById('replaceMe'));