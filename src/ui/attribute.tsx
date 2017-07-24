import React from "react";

export class AttributeProperty {
	cssClass: string;
	new: boolean;
	value: string;
	onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export class AttributeComponent extends React.Component<AttributeProperty, {}> {
	render() {
		let finalCssClass = this.props.cssClass;
		if (this.props.new) {
			finalCssClass += "-new";
		}
		return <span className={finalCssClass} onClick={this.props.onClick}>{this.props.value}</span>;
	}
}

export function newTag(givenValue: string, isNew: boolean = false): JSX.Element {
	return <AttributeComponent cssClass="tag" new={isNew} value={givenValue}/>;
}

export function newLink(givenValue: string, isNew: boolean = false): JSX.Element {
	return <AttributeComponent cssClass="link" new={isNew} value={givenValue}/>;
}
