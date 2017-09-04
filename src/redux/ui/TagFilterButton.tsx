import React from "react"; 
import { connect } from "react-redux";
import Redux from "redux";

import { RootState } from "../../state/RootState";
import { TagState } from "../../state/user/TagState";
import * as ViewActions from "../reducers/actions/ViewActions";

interface TagFilterButtonProperty {
	viewId: string;
	tag: TagState;
}

interface TagFilterButtonPropsFromState {
	selected: boolean;
}

interface TagFilterButtonPropsFromDispatch {
	onClick: () => void;
}

function mapStateToProps(state: RootState, ownProps: TagFilterButtonProperty): TagFilterButtonPropsFromState {
	const view = state.client.views[ownProps.viewId];
	return {
		selected: ownProps.tag.id === view.selectedTag,
	};
}

function mapDispatchToProps(
	dispatch: Redux.Dispatch</*Action*/any>,
	ownProps: TagFilterButtonProperty,
): TagFilterButtonPropsFromDispatch {
	return {
		onClick: () => {
			dispatch(ViewActions.activeTag(ownProps.viewId, ownProps.tag.name));
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
