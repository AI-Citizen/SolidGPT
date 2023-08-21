import { DefaultLinkFactory } from "@projectstorm/react-diagrams-defaults";
import { PathFindingLinkModel } from "@projectstorm/react-diagrams-routing";
import { CustomDefaultLinkModel } from "../custom-link-js/CustomDefaultLinkModel";
import { ListenerHandle } from "@projectstorm/react-canvas-core";

export class CustomDefaultLinkFactory extends DefaultLinkFactory<CustomDefaultLinkModel> {
	static NAME = "custom-default-factory";
	listener: ListenerHandle;

	constructor() {
		super(CustomDefaultLinkFactory.NAME);
	}

	generateModel(event): PathFindingLinkModel {
		return new PathFindingLinkModel();
	}
}