from enum import Enum


# Define an enum
class SkillIOParamType(Enum):
    StringContent = 1
    File = 2
    Directory = 3


class SkillIOParamCategory(Enum):
    BusinessRequirementsDocument = 1
    ProductRequirementsDocument = 2
    SourceCode = 3
    PlainText = 4


STRING_TO_SKILL_OUTPUT_PARAM_TYPE_DICT: dict[str, SkillIOParamType] = {
    str(SkillIOParamType.StringContent): SkillIOParamType.StringContent,
    str(SkillIOParamType.File): SkillIOParamType.File,
    str(SkillIOParamType.Directory): SkillIOParamType.Directory,
}


class SkillInputLoadingMethod(Enum):
    LOAD_FROM_OUTPUT_ID = 1
    LOAD_FROM_STRING = 2


STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT: dict[str, SkillInputLoadingMethod] = {
    str(SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID): SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID,
    str(SkillInputLoadingMethod.LOAD_FROM_STRING): SkillInputLoadingMethod.LOAD_FROM_STRING,
}


def string_to_skill_output_param_type(s: str):
    return STRING_TO_SKILL_OUTPUT_PARAM_TYPE_DICT.get(s, SkillIOParamType.StringContent)


def string_to_skill_input_loading_method(s: str):
    return STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT.get(s, SkillInputLoadingMethod.LOAD_FROM_STRING)


class SkillInput:
    config: dict = None
    param_name: str = ""
    param_type: SkillIOParamType = SkillIOParamType.StringContent
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_content: str = ""
    optional: bool = False
    loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.LOAD_FROM_STRING
    load_from_output_id: int = -1
    loaded: bool = False

    def __init__(self,
                 param_name: str,
                 param_category: SkillIOParamCategory,
                 optional: bool = False,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_category = param_category
        self.optional = optional
        self.param_type = SkillIOParamType.StringContent
        self.param_content = ""
        self.loading_method = SkillInputLoadingMethod.LOAD_FROM_STRING
        self.load_from_output_id = -1
        return

    def apply_config(self, config):
        if config is None:
            return
        self.config = config
        self.param_type = string_to_skill_output_param_type(config["param_type"])
        self.param_content = config["param_content"]
        self.loading_method = string_to_skill_input_loading_method(config["loading_method"])
        self.load_from_output_id = config["load_from_output_id"]

    def is_loaded(self):
        if self.optional \
                or self.loading_method == SkillInputLoadingMethod.LOAD_FROM_STRING \
                or self.loading_method == SkillInputLoadingMethod.LOAD_FROM_STRING:
            return True
        if self.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID and self.loaded:
            return True
        return False


class SkillOutput:
    config = None
    param_name: str = ""
    param_type: SkillIOParamType = SkillIOParamType.StringContent
    param_category: SkillIOParamCategory = SkillIOParamCategory.BusinessRequirementsDocument
    param_content: str = ""
    id: int = -1

    def __init__(self,
                 param_name: str,
                 param_type: SkillIOParamType,
                 param_category: SkillIOParamCategory,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_type = param_type
        self.param_category = param_category
        self.param_content = ""
        self.id = -1

    def apply_config(self, config):
        if config is None:
            return
        self.config = config
        self.id = config["id"]
