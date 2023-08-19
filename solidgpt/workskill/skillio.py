from enum import Enum


class SkillIOParamCategory(Enum):
    BusinessRequirementsDocument = 1
    ProductRequirementsDocument = 2
    HighLevelDesignDocument = 3
    SourceCode = 4
    PlainText = 5


class SkillInputLoadingMethod(Enum):
    LOAD_FROM_OUTPUT_ID = 1
    LOAD_FROM_STRING = 2


STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT: dict[str, SkillInputLoadingMethod] = {
    str(SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID): SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID,
    str(SkillInputLoadingMethod.LOAD_FROM_STRING): SkillInputLoadingMethod.LOAD_FROM_STRING,
}


def string_to_skill_input_loading_method(s: str):
    return STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT.get(s, SkillInputLoadingMethod.LOAD_FROM_STRING)


class SkillInput:
    config: dict = None
    param_name: str = ""
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_path: str = ""
    optional: bool = False
    loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.LOAD_FROM_STRING
    load_from_output_id: int = -1

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
        self.load_from_output_id = config["load_from_output_id"]


class SkillOutput:
    config = None
    param_name: str = ""
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_path: str = ""
    id: int = -1

    def __init__(self,
                 param_name: str,
                 param_category: SkillIOParamCategory,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_category = param_category
        self.param_path = ""
        self.id = -1

    def apply_config(self, config):
        if config is None:
            return
        self.config = config
        self.id = config["id"]
