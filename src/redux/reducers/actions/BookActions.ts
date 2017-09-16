import { Action } from "redux";
import { ActionType } from "./ActionType";

export type MoveActiveItemUpViewAction = Action;
export type MoveActiveItemDownViewAction = Action;
export type MoveActiveItemLeftViewAction = Action;
export type MoveActiveItemRightViewAction = Action;

export function moveActiveItemUp(): MoveActiveItemUpViewAction {
	return {
		type: ActionType.MOVE_UP_ACTIVE_VIEW,
	};
}

export function moveActiveItemDown(): MoveActiveItemDownViewAction {
	return {
		type: ActionType.MOVE_DOWN_ACTIVE_VIEW,
	};
}

export function moveActiveItemLeft(): MoveActiveItemLeftViewAction {
	return {
		type: ActionType.MOVE_LEFT_ACTIVE_VIEW,
	};
}

export function moveActiveItemRight(): MoveActiveItemRightViewAction {
	return {
		type: ActionType.MOVE_RIGHT_ACTIVE_VIEW,
	};
}
