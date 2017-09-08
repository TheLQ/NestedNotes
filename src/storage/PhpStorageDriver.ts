import { WebStorageDriver } from "./WebStorageDriver";

export class PhpStorageDriver extends WebStorageDriver {
	public constructor() {
		super(
			"../src-php/json.php",
			"../src-php/json.php?mode=save",
		);
	}
}
