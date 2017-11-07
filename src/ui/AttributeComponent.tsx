import React from "react";

export class AttributeProperty {
	public type: AttributeType;
	public new: boolean;
	public value: {};
	public onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export enum AttributeType {
	Link,
	Tag,
}

export class AttributeComponent extends React.Component<AttributeProperty> {
	public render() {
		let finalCssClass = AttributeType[this.props.type] .toLowerCase();
		if (this.props.new) {
			finalCssClass = `${finalCssClass} ${finalCssClass}-new`;
		}

		// let value = this.props.value;
		// if (this.props.type === AttributeType.Link) {
		// 	value
		// }
		return <span className={finalCssClass} onClick={this.props.onClick}>{this.props.value}</span>;
	}
}

export function newTag(givenValue: string, isNew: boolean = false): JSX.Element {
	return <AttributeComponent type={AttributeType.Tag} new={isNew} value={givenValue} key={givenValue}/>;
}

const newLinkExp = /[a-zA-Z0-9\.]+/g;

export function newLink(givenValue: string, isNew: boolean = false): JSX.Element {
	// v2: URL's may be invalid while written, so try basic matching
	// const url = new URL(givenValue);
	// const hostname = url.hostname
	const matches = givenValue.match(newLinkExp);
	// console.log("for match " + givenValue, matches);
	const hostname = (matches === null || matches.length === 1)
		? "New Link"
		// skip http protocol, second match is probably domain
		: matches[1];

	const value = <a href={givenValue}>{hostname}</a>;

	return <AttributeComponent type={AttributeType.Link} new={isNew} value={value} key={givenValue}/>;
}
