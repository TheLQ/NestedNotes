"use strict"

// import jquery from 'jquery';
import * as h from './utils';
import React from 'react';
import ReactDOM from 'react-dom';

class List extends React.Component {
    render() {
        let list = this.props.list;
        console.log("list", list)
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
    render() {
        let item = this.props.itemTree;
        console.log("item", item)
        let nestedList = "nested" in item
            ? <List list={item.nested} />
            : null;
        return (
            <li>{item.text}{nestedList}</li>
        );
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