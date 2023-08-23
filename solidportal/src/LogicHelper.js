export class LogicHelper {
	constructor() {
		//the list of all the Node added in history
		this.data = {};
		//the node, which being clicked
		this.clickedInfo = {}

		if (!LogicHelper.instance) {
			LogicHelper.instance = this;
		}
		return LogicHelper.instance;

	}
	//record for the list of all the Node added in history.
	setData(key, value) {
		this.data[key] = value;
	}

	getData(key) {
		return this.data[key];
	}

	getAllData() {
		return this.data;
	}

	removeData(key) {
		delete this.data[key];
	}

	clearAllData() {
		this.data = {};
	}

	//record for the node, which being clicked.
	setClickedInfo(key, value) {
		this.clickedInfo[key] = value;
	}

	getClickedInfo(key) {
		return this.clickedInfo[key];
	}

	getAllClickedInfo() {
		return this.clickedInfo;
	}

	removeClickedInfo(key) {
		delete this.clickedInfo[key];
	}

	clearAllClickedInfo() {
		this.clickedInfo = {};
	}

}

export class DataClass {
	constructor(jsonDataClass, node) {
		this.jsonDataClass = jsonDataClass;
		this.node = node;
	}
}

export class JsonDataClass {
	constructor(node_id, manual_review_result, agent, skill, inputs, outputs) {
		this.node_id = node_id;
		this.manual_review_result = manual_review_result;
		this.agent = agent;
		this.skill = skill;
		this.inputs = inputs;
		this.outputs = outputs;
	}
}


export class Inputs {
	constructor(param_path , loading_method, load_from_output_id) {
		this.param_path = param_path;
		this.loading_method = loading_method;
		this.load_from_output_id = load_from_output_id;
	}
}

export class Outputs {
	constructor(id) {
		this.id = id;
	}
}