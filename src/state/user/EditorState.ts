import { Entry } from "../StringMap";

export interface EditorState extends Entry {
	bookId: string;
	textValue: string;
	tags: string[];
	newTag: string;
	links: string[];
	deleteOnCancel: boolean;
}
