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
	onClick(): void;
}

function mapStateToProps(state: RootState, ownProps: TagFilterButtonProperty): TagFilterButtonPropsFromState {
	return {
		selected: ownProps.tag.id === state.client.views.active,
	};
}

function mapDispatchToProps(
	dispatch: Redux.Dispatch</*Action*/{}>,
	ownProps: TagFilterButtonProperty,
): TagFilterButtonPropsFromDispatch {
	return {
		onClick: () => {
			dispatch(ViewActions.activeTag(ownProps.viewId, ownProps.tag.name));
		},
	};
}

type FinalProps = TagFilterButtonProperty & TagFilterButtonPropsFromState & TagFilterButtonPropsFromDispatch;

function TagFilterButtonRender(props: FinalProps): JSX.Element {
	return <button key={props.tag.name}>{props.selected ? "Selected: " : ""}{props.tag.name}</button>;
}

export const TagFilterButton = connect<
	TagFilterButtonPropsFromState,
	TagFilterButtonPropsFromDispatch,
	TagFilterButtonProperty
>(mapStateToProps, mapDispatchToProps)(TagFilterButtonRender);
