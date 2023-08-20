import * as React from 'react';
import {Action, ActionEvent, InputType} from '@projectstorm/react-canvas-core';
import {JSCustomNodeModel} from "./custom-node-js/JSCustomNodeModel";
import {LogicHelper} from "./LogicHelper";

interface CustomClickedNodesActionOptions {
	keyCodes?: number[];
}

/**
 * Deletes all selected items, but asks for confirmation first
 */
export class CustomClickItemsAction extends Action {
	constructor(options: CustomClickedNodesActionOptions = {}) {
		options = {
			keyCodes: [46, 8],
			...options
		};
		super({
			type: InputType.MOUSE_UP,
			fire: (event: ActionEvent<React.MouseEvent>) => {
				let dataStorage = new LogicHelper();
				const selectedEntities = this.engine.getModel().getSelectedEntities();
				if (selectedEntities.length > 0) {
					if (selectedEntities[0].getType() == 'js-custom-node') {
						dataStorage.setClickedInfo("clickedNodeId",(selectedEntities[0] as JSCustomNodeModel).getOptions().id);
						this.engine.getModel().fireEvent({}, 'nodeClicked');
					}
				}
			}
		});
	}
}