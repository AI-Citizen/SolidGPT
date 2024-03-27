from enum import Enum


class SkillIOParamCategory(int, Enum):
    BusinessRequirementsDocument = 1
    ProductRequirementsDocument = 2
    HighLevelDesignDocument = 3
    SourceCode = 4
    PlainText = 5
    KanbanBoard = 6
    YAML = 7
    CODE_PLAIN_TEXT = 8
    CODE_PLAN = 9

class SkillInputLoadingMethod(Enum):
    LOAD_FROM_OUTPUT_ID = 1
    LOAD_FROM_STRING = 2
    LOAD_FROM_CACHE_STRING = 3


STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT: dict[str, SkillInputLoadingMethod] = {
    str(SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID): SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID,
    str(SkillInputLoadingMethod.LOAD_FROM_STRING): SkillInputLoadingMethod.LOAD_FROM_STRING,
    str(SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING): SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING,
}


def string_to_skill_input_loading_method(s: str):
    return STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT.get(s, SkillInputLoadingMethod.LOAD_FROM_STRING)


class SkillOutput:
    config = None
    param_name: str = ""
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_path: str = ""
    id: int = -1
    to_display: bool = False

    def __init__(self,
                 param_name: str,
                 param_category: SkillIOParamCategory,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_category = param_category
        self.param_path = ""
        self.id = -1
        self.to_display = False

    def apply_config(self, config):
        if config is None:
            return
        self.config = config
        self.id = config["id"]
        self.to_display = config.get("to_display", False)


class SkillInput:
    config: dict = None
    param_name: str = ""
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_path: str = ""
    optional: bool = False
    loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.LOAD_FROM_STRING
    load_from_output_id: int = -1
    skill_output: SkillOutput = None
    content: str = ""

    def __init__(self,
                 param_name: str,
                 param_category: SkillIOParamCategory,
                 optional: bool = False,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_category = param_category
        self.optional = optional
        self.loading_method = SkillInputLoadingMethod.LOAD_FROM_STRING
        self.load_from_output_id = -1
        return

    def apply_config(self, config):
        if config is None:
            return
        self.config = config
        self.param_path = config["param_path"]
        self.loading_method = string_to_skill_input_loading_method(config["loading_method"])
        if "load_from_output_id" in config:
            self.load_from_output_id = config["load_from_output_id"]
        else:
            self.load_from_output_id = -1
        if self.loading_method == SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING:
            self.content = config["content"]

    def get_input_path(self):
        if self.loading_method == SkillInputLoadingMethod.LOAD_FROM_STRING:
            return self.param_path
        elif self.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID:
            return self.skill_output.param_path
        return ""
    
class SkillInputConfig:
    def __init__(self, param_path: str, loading_method: SkillInputLoadingMethod, load_from_output_id: int, content: str = None):
        self.param_path = param_path
        self.loading_method = loading_method
        self.load_from_output_id = load_from_output_id
        self.content = content
    
    def to_dict(self):
        return {
            "param_path": self.param_path,
            "loading_method": str(self.loading_method),
            "load_from_output_id": self.load_from_output_id,
            "content": self.content
        }
