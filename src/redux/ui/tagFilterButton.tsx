import React from "react"; 
import { connect } from "react-redux";
import Redux from "redux";

import { TagModel } from "../../model/tag";

import * as Reducers from "../reducers";

interface TagFilterButtonProperty {
	tag: TagModel;
	selected: boolean;
}

function mapDispatchToProps(dispatch: Redux.Dispatch</*Action*/any>, ownProps: TagFilterButtonProperty) {
	return {
		onClick: () => {
			dispatch(Reducers.activeTag(ownProps.tag))
		},
	};
}

function TagFilterButton(props: TagFilterButtonProperty): JSX.Element {
	return <button key={props.tag.name}>{props.selected ? "Selected: " : ""}{props.tag.name}</button>;
}

const val = connect(null, mapDispatchToProps)(TagFilterButton);
export default val;
