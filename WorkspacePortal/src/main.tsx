import * as React from 'react';
import {createRoot} from 'react-dom/client';
import './main.css';
import createEngine, { DiagramModel} from '@projectstorm/react-diagrams';
import {JSCustomNodeFactory} from './custom-node-js/JSCustomNodeFactory';
import {BodyWidget} from './BodyWidget';
import {LeftPanelWidget} from "./LeftPanelWidget";


// create an instance of the engine
const engine = createEngine();
// register the two engines
engine.getNodeFactories().registerFactory(new JSCustomNodeFactory() as any);

// create a diagram model
const model = new DiagramModel();
engine.setModel(model);




const rootApp = createRoot(document.querySelector('#application'));
document.addEventListener('DOMContentLoaded', () => {
	rootApp.render(<BodyWidget engine={engine}/>);
})
document.addEventListener('DOMContentLoaded', () => {
		const root = createRoot(document.querySelector('#left'));
		root.render(<LeftPanelWidget engine={engine} model = {model}/>
);
	}
);



