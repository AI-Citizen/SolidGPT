# SolidGPT

## Structure

### WorkSkill
A WorkSkill is a skill to be executed, for example, writing a production requirement document.

A WorkSkill have inputs and outputs, and these are defined by each specific skill itself.

```python
    inputs: list[SkillInput] = []
    outputs: list[SkillOutput] = []
```

### SkillInput

A SkillInput has:

| Field            | Description          |
|------------------|----------------------|
| `param_name` | Name of this input. |
| `param_category` | This enum indicates the category of the param, for example, the category can be plaintext, python source code, or production requirement document.|
| `loading_method` | This enum indicates how the input is going to be loaded. Currently there are two Loading methods, loading manually or loading from another output.|
| `load_from_output_id` | This is only effective when `loading_method` is loading from another output, this points to the id of that output. |
| `param_path` | This is only effective when `loading_method` is loading manually, this points path to load the input. |
|

### SkillOutput

A SKillOutput has:

| Field            | Description          |
|------------------|----------------------|
| `param_name` | Name of this output. |
| `param_category` | This enum indicates the category of the param, for example, the category can be plaintext, python source code, or production requirement document.|
| `id` | ID of this output. |
|

### WorkAgent
A WorkAgent is an agent that can perform certains skills. A specific WorkAgent is capable of performing multiple skills.

### WorkNode
A WorkNode is a unit on a WorkGraph contains a WorkAgent and the WorkSkill that agent is going to perform. 

### WorkGraph
A WorkGraph is a graph that contains multiple WorkNodes.

## Adding a new WorkAgent/WorkSkill

The first step to add a new WorkAgent / WorkSkill is to add the agent/skill names to constants.py.

```python
"""Agent Names"""
AGENT_NAME_PRODUCT_MANAGER = "Product Manager"
...
AGENT_NEW_AGENT = "New Agent Name here"

"""Skill Names"""
SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION = "Write Product Requirement Documentation"
SKILL_NAME_USE_NOTION = "Use Notion"
...
AGENT_NEW_SKILL = "New Skill Name here"
```

To add a new Agent, follow `AgentProductManager` as an example:

```python
class AgentProductManager(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().agent_setup(
            name=AGENT_NAME_PRODUCT_MANAGER,
            skills_available=[SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION, SKILL_NAME_USE_NOTION],
            skill=skill,
            )
```

You'll need to specify agent name, and the skill names the agent can perform.

To add a new Skill, follow `WriteHLD` as an example:

Initialization:
```python
def __init__(self):
        # call super().__init__()
        super().__init__()

        # set GPT manager if necessary
        self.gpt_manager = GPTManager()

        # set skill name
        self.name = SKILL_NAME_WRITE_HLD

        # set all inputs and register each input with add_input()
        self.skill_input = SkillInput(
            "Design Doc",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_input(self.skill_input)

        # set all outputs and register each output with add_output()
        self.skill_output = SkillOutput(
            "Write HLD Result",
            SkillIOParamCategory.HighLevelDesignDocument,
        )
        self.add_output(self.skill_output)

        # do anything special for current skill...
        self.prd_md : str = None
```

Load Input:
```python
def _read_input(self):
        # get path to load input
        input_path = self.get_input_path(self.skill_input)

        # load input for current skill, some existing loading methods can be found in util.py
        self.prd_md = load_from_text(input_path)
```

Execution:
```python
def execution_impl(self):
        print("Printing HLD result here...")
        # execution
        hld_md = self.__run_write_hld_model()

        # saving output file
        save_to_md2(self.skill_output.param_path, hld_md)
        return
```

Note, you'll need to use the exact same function names for `__init__`, `_read_input` and `execution_impl`, as they override the methods in WorkSkill class.

### Update saveload mappings

the last thing is to update the mappings in `saveload.py`

```python
SKILL_NAME_TO_CONSTRUCTOR: dict[str, Type[WorkSkill]] = {
    SKILL_NAME_DEBUG_CODE: DebugCode,
    SKILL_NAME_WRITE_CODE: WriteCode,
    SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION: WritePRD,
    SKILL_NAME_WRITE_HLD: WriteHLD,
    SKILL_NAME_CREATE_KANBAN_BOARD: CreateKanBan,
    ...
    NewSKillName: NewSkillClass
}


AGENT_NAME_TO_CONSTRUCTOR: dict[str, Type[WorkAgent]] = {
    AGENT_NAME_SOFTWARE_DEVELOPER: AgentSoftwareDeveloper,
    AGENT_NAME_PRODUCT_MANAGER: AgentProductManager,
    AGENT_NAME_PRINCIPAL_ENGINEER: AgentPrincipalEngineer,
    ...
    NewAgentName: NewAgentClass
}
```

## Config

An example config file looks like this, in this example, node 1 is loading from a local file, and node 0 is loading from node 1's output

```json
[
    {
        "node_id": 1, // current node id
        "manual_review_result": false, // boolean indicating whether current node needs to pause before executing the next one
        "agent": "Product Manager", // agent name, corresponds to the agent name in constants.py
        "skill": "Write Product Requirement Documentation", // skill name, corresponds to the skill name in constants.py
        "inputs": [
            {
                "param_path": "in/ProductBasicInfo.json", // path to load the file, can be relative or absolute. This is only used when manual loading.
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING", // loading method
                "load_from_output_id": -1 // id of the output that to load from, this is only used when loading from output id is used.
            }
        ],
        "outputs": [
            {
                "id": 1 // id of the output.
            }
        ]
    },
    {
        "node_id": 0,
        "manual_review_result": false,
        "agent": "Product Manager",
        "skill": "Use Notion",
        "inputs": [
            {
                "param_path": "",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                "load_from_output_id": 1
            }
        ],
        "outputs": [
            {
                "id": 2
            }
        ]
    }
]
```

Note: output id is different from node id.


## Running the program

To run the program, simply load from json and then execute.

An example:
```python
def run_test_with_config():
    app = WorkGraph()
    app.load_data("config/config_data.json")
    app.execute()


GPTManager()
run_test_with_config()

```
