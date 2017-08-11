import React from "react"; 
import { connect } from "react-redux";
import Redux from "redux";

import { TagState } from "../../state/tag";

import * as Actions from "../reducers/Actions";

interface TagFilterButtonProperty {
	tag: TagState;
	selected: boolean;
}

function mapDispatchToProps(dispatch: Redux.Dispatch</*Action*/any>, ownProps: TagFilterButtonProperty) {
	return {
		onClick: () => {
			dispatch(Actions.activeTag(ownProps.tag));
		},
	};
}

function TagFilterButton(props: TagFilterButtonProperty): JSX.Element {
	return <button key={props.tag.name}>{props.selected ? "Selected: " : ""}{props.tag.name}</button>;
}

const val = connect(null, mapDispatchToProps)(TagFilterButton);
export default val;
