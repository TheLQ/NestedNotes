import React from "react"; 
import { connect } from "react-redux";

import { RootState } from "../../state/root";
import { TagState } from "../../state/tag";

import TagFilterButton from "./tagFilterButton";

interface TagFilterPropsFromState {
	tags: TagState[];
}

export function TagFilter(props: TagFilterPropsFromState): JSX.Element {
	const tagButtons = props.tags.map((tagIn) => (
			<TagFilterButton
				tag={tagIn}
				key={tagIn.name}
			/>
	));
	return <div>{tagButtons}</div>;
}

function mapStateToProps(state: RootState): TagFilterPropsFromState {
	return {
		tags: Object.values(state.userData.tags),
	};
}

const component = connect<TagFilterPropsFromState, void, {}>(mapStateToProps)(TagFilter);
export default component;
