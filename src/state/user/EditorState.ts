import { Entry } from "../StringMap";

export interface EditorState extends Entry {
	bookId: string;
	text: string;
	textRaw: string;
	tags: string[];
	links: string[];
	deleteOnCancel: boolean;
}
