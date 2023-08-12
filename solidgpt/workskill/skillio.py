from enum import Enum


# Define an enum
class SkillOutputParamType(Enum):
    STRING = 1
    XLSX = 2
    DOC = 3
    MD = 4
    FILE = 5


STRING_TO_SKILL_OUTPUT_PARAM_TYPE_DICT: dict[str, SkillOutputParamType] = {
    "STRING": SkillOutputParamType.STRING,
    "XLSX": SkillOutputParamType.XLSX,
    "DOC": SkillOutputParamType.DOC,
    "MD": SkillOutputParamType.MD,
    "FILE": SkillOutputParamType.FILE,
}


class SkillInputLoadingMethod(Enum):
    LOAD_FROM_LAST_OUTPUT = 1
    LOAD_FROM_OUTPUT_ID = 2
    DO_NOT_LOAD = 3


STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT: dict[str, SkillInputLoadingMethod] = {
    "LOAD_FROM_LAST_OUTPUT": SkillInputLoadingMethod.LOAD_FROM_LAST_OUTPUT,
    "LOAD_FROM_OUTPUT_ID": SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID,
    "DO_NOT_LOAD": SkillInputLoadingMethod.DO_NOT_LOAD,
}


def string_to_skill_output_param_type(s: str):
    return STRING_TO_SKILL_OUTPUT_PARAM_TYPE_DICT.get(s, SkillOutputParamType.STRING)


def string_to_skill_input_loading_method(s: str):
    return STRING_TO_SKILL_INPUT_LOADING_METHOD_DICT.get(s, SkillInputLoadingMethod.DO_NOT_LOAD)


class SkillInput:
    config: dict = None
    param_name: str = ""
    param_type: SkillOutputParamType = SkillOutputParamType.STRING
    param_content: str = ""
    optional: bool = False
    loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.DO_NOT_LOAD
    load_from_output_id: int = -1
    loaded: bool = False

    def __init__(self,
                 config: dict,
                 param_name: str,
                 param_type: SkillOutputParamType,
                 param_content: str,
                 optional: bool = False,
                 loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.DO_NOT_LOAD,
                 load_from_output_id: int = -1,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_type = param_type
        self.param_content = param_content
        self.optional = optional
        self.loading_method = loading_method
        self.load_from_output_id = load_from_output_id
        self.config = config
        self.load_from_config()
        return

    def load_from_config(self):
        if self.config is None:
            return
        self.param_type = string_to_skill_output_param_type(self.config["param_type"])
        self.param_content = self.config["param_content"]
        self.loading_method = string_to_skill_input_loading_method(self.config["param_content"])
        self.load_from_output_id = self.config["load_from_output_id"]

    def is_loaded(self):
        if self.optional or self.loading_method == SkillInputLoadingMethod.DO_NOT_LOAD:
            return True
        if self.loading_method == SkillInputLoadingMethod.LOAD_FROM_LAST_OUTPUT and self.loaded:
            return True
        if self.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID and self.loaded:
            return True
        return False


class SkillOutput:
    config = None
    param_name: str = ""
    param_type: SkillOutputParamType = SkillOutputParamType.STRING
    param_content: str = ""
    id: int = -1

    def __init__(self, config, param_name, param_type, param_content, id):
        # Initialization
        self.param_name = param_name
        self.param_type = param_type
        self.param_content = param_content
        self.id = id
        self.config = config
        self.load_from_config()

    def load_from_config(self):
        if self.config is None:
            return
        self.param_type = string_to_skill_output_param_type(self.config["param_type"])
        self.param_content = self.config["param_content"]
        self.id = self.config["id"]
