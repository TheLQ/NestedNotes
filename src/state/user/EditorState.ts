import { Entry } from "../StringMap";

export interface EditorState extends Entry {
	bookId: string;
	parent: string | undefined;
	text: string;
	textRaw: string;
	tags: string[];
	links: string[];
	deleteOnCancel: boolean;
}
