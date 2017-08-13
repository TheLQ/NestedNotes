import React from "react"; 
import { connect } from "react-redux";
import Redux from "redux";

import { RootState } from "../../state/root";
import { TagState } from "../../state/tag";

import * as Actions from "../reducers/Actions";

interface TagFilterButtonProperty {
	tag: TagState;
}

interface TagFilterButtonPropsFromState {
	selected: boolean;
}

interface TagFilterButtonPropsFromDispatch {
	onClick: () => void;
}

function mapStateToProps(state: RootState, ownProps: TagFilterButtonProperty): TagFilterButtonPropsFromState {
	return {
		selected: ownProps.tag.id === state.selectedTag,
	}
}

function mapDispatchToProps(
	dispatch: Redux.Dispatch</*Action*/any>,
	ownProps: TagFilterButtonProperty,
): TagFilterButtonPropsFromDispatch {
	return {
		onClick: () => {
			dispatch(Actions.activeTag(ownProps.tag));
		},
	};
}

type FinalProps = TagFilterButtonProperty & TagFilterButtonPropsFromState & TagFilterButtonPropsFromDispatch;

function TagFilterButton(props: FinalProps): JSX.Element {
	return <button key={props.tag.name}>{props.selected ? "Selected: " : ""}{props.tag.name}</button>;
}

const val = connect<
	TagFilterButtonPropsFromState,
	TagFilterButtonPropsFromDispatch,
	TagFilterButtonProperty
>(mapStateToProps, mapDispatchToProps)(TagFilterButton);
export default val;
