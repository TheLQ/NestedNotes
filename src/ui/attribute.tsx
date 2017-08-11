import React from "react"; 

export class AttributeProperty {
	type: AttributeType;
	new: boolean;
	value: any;
	onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export enum AttributeType {
	Link,
	Tag,
}

export class AttributeComponent extends React.Component<AttributeProperty, {}> {
	render() {
		let finalCssClass = AttributeType[this.props.type] .toLowerCase();
		if (this.props.new) {
			finalCssClass = finalCssClass + " " + finalCssClass + "-new";
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

export function newLink(givenValue: string, isNew: boolean = false): JSX.Element {
	const url = new URL(givenValue);
	const value = <a href={givenValue}>{url.hostname}</a>;
	return <AttributeComponent type={AttributeType.Link} new={isNew} value={value} key={givenValue}/>;
}
