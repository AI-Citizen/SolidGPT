import * as React from 'react';
import {useEffect, useState} from 'react';
import {DiagramEngine, DiagramModel} from '@projectstorm/react-diagrams';
import {Button, Checkbox, Input, Select, Upload} from "antd";
import {JSCustomNodeModel} from "./custom-node-js/JSCustomNodeModel";
import {CustomClickItemsAction} from "./CustomClickItemsAction";
import {DataClass, Inputs, JsonDataClass, LogicHelper, Outputs} from "./LogicHelper";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import axios from "axios";
import config from "./config";

export interface BodyWidgetProps {
	engine: DiagramEngine;
	model: DiagramModel
}

export class LeftPanelWidget extends React.Component<BodyWidgetProps> {
	render() {
		const Hooks = () => {
			const engine = this.props.engine;
			// create an instance of the engine
			let dataStorage = new LogicHelper();
			// create a diagram model
			const model = this.props.model;
			const [agentValue, setAgentValue] = useState("Software Developer");
			const [skillValue, setSkillValue] = useState("Write Product Requirement Documentation");
			const [skillListValue, setSkillListValue] = useState(["Debug Code", "Write Code", "Write Product Requirement Documentation",
				"Use Notion", "Write High Level Design", "Create Kanban Board", "Custom Skill", "Write lowdefy YAML", "Host and run web app"]);
			const [manualReviewResultBool, setManualReviewResultBool] = useState(false);
			const [file, setFile] = useState(null);
			const [fileName, setFileName] = useState();

			useEffect(() => {
				// Fetch the list of files from the server when the component mounts
				axios.get(config.uploadApiBaseUrl + '/listfiles')
					.then((response) => {
						const customizeSkills = response.data.files
						customizeSkills.map((item, index) => (
							handleFileSelect(item)
						))
					})
					.catch((error) => {
						console.error('Error fetching file list:', error);
					});
			}, []);


			const handleFileSelect = async (filename) => {
				try {
					const response = await axios.get(config.uploadApiBaseUrl +`/readfile/${filename}`);
					const jsonObject = JSON.parse(response.data.content);
					setSkillListValue((skillListValue) => [...skillListValue, jsonObject.skill_name]);
				} catch (error) {
					console.error('Error fetching file content:', error);
				}
			}

			function getRandomNumber(min, max) {
				const randomDecimal = Math.random();
				const randomNumber = min + randomDecimal * (max - min + 1);
				return Math.floor(randomNumber);
			}

			const handleAgentChange = (value: string) => {
				setAgentValue(value);
			};

			const handleSkillChange = (value: string) => {
				setSkillValue(value)
			};

			const onManualReviewResultChange = (e: CheckboxChangeEvent) => {
				setManualReviewResultBool(e.target.checked)
			};

			function isEmptyObject(obj) {
				return Object.keys(obj).length === 0;
			}

			const downloadJSON = (data, filename) => {
				const jsonData = JSON.stringify(data, null, 2); // Convert the list to JSON string
				const blob = new Blob([jsonData], {type: 'application/json'}); // Create a Blob object

				const url = URL.createObjectURL(blob); // Create a URL for the Blob
				const link = document.createElement('a'); // Create a <a> element
				link.href = url;
				link.download = filename || 'data.json'; // Set the filename for the download
				link.click(); // Simulate a click on the link

				URL.revokeObjectURL(url); // Release the URL object
			};

			const handleFileChange = (e) => {
				setFile(e.target.files[0]);
				setFileName(e.target.files[0].name);
			};

			const handleUpload = async () => {
				const formData = new FormData();
				formData.append('file', file);

				try {
					await axios.post(config.uploadApiBaseUrl +'/upload', formData);
					console.log('File uploaded successfully!');
				} catch (error) {
					console.error('Error uploading file:', error);
				}
			};

			function addNewNode(nodeNew) {
				nodeNew.setPosition(getRandomNumber(1, 300), getRandomNumber(1, 300));
				model.addAll(nodeNew)
				engine.setModel(model);
				// register a CustomClickItemsAction with custom keyCodes (in this case, only Delete key)
				engine.getActionEventBus().registerAction(new CustomClickItemsAction());
				model.registerListener({
					nodeClicked: (event: any) => {
						setAgentValue((((dataStorage.getData(dataStorage.getClickedInfo("clickedNodeId")) as
							DataClass).jsonDataClass) as JsonDataClass).agent);
						setManualReviewResultBool((((dataStorage.getData(dataStorage.getClickedInfo("clickedNodeId")) as
							DataClass).jsonDataClass) as JsonDataClass).manual_review_result);
					},
				})
				model.registerListener({
					linksUpdated: (event) => {
						event.link.registerListener({
							targetPortChanged: (event) => {
								console.log('Link Changed' + event.entity.getSourcePort().getID());
								console.log('Link Changed' + event.entity.getTargetPort().getID());
							}
						})
					}
				});
			}

			return <div className="left">
				<div>select agent:</div>
				<Select
					defaultValue={agentValue}
					style={{width: "100%"}}
					onChange={handleAgentChange}
					value={agentValue}
					options={[
						{value: 'Software Developer', label: 'Software Developer'},
						{value: 'Principal Engineer', label: 'Principal Engineer'},
						{value: 'Product Manager', label: 'Product Manager'},
						{value: 'Custom Agent', label: 'Custom Agent'},
					]}
				/>
				<div>select skill:</div>
				<Select
					defaultValue={skillValue}
					style={{width: "100%"}}
					onChange={handleSkillChange}
					value={skillValue}
					options={skillListValue.map(item => ({
						value: item,
						label: item
					}))}
				/>
				<Checkbox onChange={onManualReviewResultChange} checked={manualReviewResultBool}>Manual Review Result</Checkbox>
				<Button
					block
					ghost
					shape="rectangle"
					size="large"
					variant="base"
					onClick={() => {
						const nodeNew = new JSCustomNodeModel({color: 'rgb(38,39,42)'});
						dataStorage.setData(nodeNew.getOptions().id, new DataClass(
							new JsonDataClass(nodeNew.getOptions().id, manualReviewResultBool, agentValue, skillValue, [new Inputs("","SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID","")],
								[new Outputs(Date.now() + Math.floor(Math.random()*9))]), nodeNew));
						addNewNode(nodeNew);

					}}>
					Add Node
				</Button>
				<Input type="file" onChange={handleFileChange}/>
				<Button block
						ghost
						shape="rectangle"
						size="large"
						variant="base"
						onClick={() => {
							handleUpload().then(r => {
								const nodeNew = new JSCustomNodeModel({color: 'rgb(38,39,42)'});
								dataStorage.setData(nodeNew.getOptions().id, new DataClass(
									new JsonDataClass(nodeNew.getOptions().id, manualReviewResultBool, agentValue, skillValue, [new Inputs(fileName,"SkillInputLoadingMethod.LOAD_FROM_STRING","")],
										[new Outputs(Date.now() + Math.floor(Math.random()*9))]), nodeNew));
								addNewNode(nodeNew);

								}
							);
						}

						}>Add Node With Input File</Button>
				<Button
					block
					ghost
					shape="rectangle"
					size="large"
					variant="base"
					onClick={() => {
						const json = [];
						const allNode = engine.getModel().getNodes();
						const outputMap = {}
						for (const key in dataStorage.getAllData()) {
							if (dataStorage.getAllData().hasOwnProperty(key)) {
								const value = dataStorage.getAllData()[key];
								if (allNode.includes((value as DataClass).node)) {
									if (!isEmptyObject(((value as DataClass).node as JSCustomNodeModel).getPort("in").links)) {
										Object.keys(((value as DataClass).node as JSCustomNodeModel).getPort("in").links).forEach(item => {
											((value as DataClass).jsonDataClass).inputs[0].load_from_output_id = item;
										});
									}
									if (!isEmptyObject(((value as DataClass).node as JSCustomNodeModel).getPort("out").links)) {
										Object.keys(((value as DataClass).node as JSCustomNodeModel).getPort("out").links).forEach(item => {
											outputMap[item] = (((value as DataClass).jsonDataClass.outputs[0]) as Outputs).id
										});
									}
									json.push((value as DataClass).jsonDataClass);
								} else {
									dataStorage.removeData(key)
								}
							}
						}

						json.forEach(item => {
							item.inputs.forEach(load_from_output_id => {
								load_from_output_id.load_from_output_id = outputMap[load_from_output_id.load_from_output_id]
							})
						})
						downloadJSON(json, "json")
					}}>
					DownLoadJson
				</Button>
			</div>;
		}
		return <Hooks/>
	}
}

