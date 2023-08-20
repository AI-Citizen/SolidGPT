import {DefaultPortModel, NodeModel, PathFindingLinkFactory} from '@projectstorm/react-diagrams';
import {CustomDefaultLinkFactory} from "../custom-link-js/CustomDefaultLinkFactory";

/**
 * Example of a custom model using pure javascript
 */
export class JSCustomNodeModel extends NodeModel {
	constructor(options = {}) {
		super({
			...options,
			type: 'js-custom-node'
		});
		this.color = options.color || { options: 'red' };

		// setup an in and out port
		this.addPort(
			new CustomizePortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new CustomizePortModel({
				in: false,
				name: 'out'
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color
		};
	}

	deserialize(ob, engine) {
		super.deserialize(ob, engine);
		this.color = ob.color;
	}

	// there is a bug for existing lib need to set a moving border. https://github.com/projectstorm/react-diagrams/issues/722
	setPosition(x, y) {
		const minX = 20; // Minimum X-coordinate boundary
		const minY = 20; // Minimum Y-coordinate boundary
		const maxX = 1380; // Maximum X-coordinate boundary
		const maxY = 800; // Maximum Y-coordinate boundary

		// Ensure the node stays within the allowed boundaries
		const boundedX = Math.min(Math.max(x, minX), maxX);
		const boundedY = Math.min(Math.max(y, minY), maxY);

		super.setPosition(boundedX, boundedY);
	}
}



class CustomizePortModel extends DefaultPortModel {
	createLinkModel(f) {
		 //let factory = new PathFindingLinkFactory();
		let factory = new CustomDefaultLinkFactory();
		return factory.generateModel({});
	}
}