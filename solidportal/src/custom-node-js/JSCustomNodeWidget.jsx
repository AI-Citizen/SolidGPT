import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';
import {DataClass, LogicHelper} from "../LogicHelper";
import {Checkbox} from "antd";

export class JSCustomNodeWidget extends React.Component {
	render() {
		let dataStorage = new LogicHelper();
		return (
			<div className="custom-node" style={{color: this.props.node.color}}>
				{!dataStorage.getData(this.props.node.getID()).jsonDataClass.inputs[0].param_path && <><PortWidget
					engine={this.props.engine} port={this.props.node.getPort('in')}>
					<div className="circle-port-input">
						<p className="blue-text">input</p>
					</div>
				</PortWidget><PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
					<div className="circle-port-output">
						<p className="red-text">output</p>
					</div>
				</PortWidget></>}
				{dataStorage.getData(this.props.node.getID()).jsonDataClass.inputs[0].param_path && <>
					<PortWidget engine={this.props.engine} port={this.props.node.getPort('out')}>
						<div className="circle-port-output-only">
							<p className="red-text">output</p>
						</div>
					</PortWidget></>
				}
				<div className="custom-node-color">
					{dataStorage.getData(this.props.node.getID()).jsonDataClass.agent}
					<div>
						Skill: {dataStorage.getData(this.props.node.getID()).jsonDataClass.skill}
					</div>
					<Checkbox checked={dataStorage.getData(this.props.node.getID()).jsonDataClass.manual_review_result}
							  disabled={true}>Manual Review Result</Checkbox>
					{dataStorage.getData(this.props.node.getID()).jsonDataClass.inputs[0].param_path && <div>Input File Name: {dataStorage.getData(this.props.node.getID()).jsonDataClass.inputs[0].param_path}</div>}
				</div>

			</div>
		);
	}
}
