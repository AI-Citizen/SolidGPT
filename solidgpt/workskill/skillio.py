from enum import Enum


# Define an enum
class SkillOutputParamType(Enum):
    STRING = 1
    XLSX = 2
    DOC = 3
    MD = 4
    FILE = 5


class SkillInputLoadingMethod(Enum):
    LOAD_FROM_LAST_OUTPUT = 1
    LOAD_FROM_OUTPUT_ID = 2
    DO_NOT_LOAD = 3


class SkillInput:
    config: dict = None
    param_name: str = ""
    param_type: SkillOutputParamType = SkillOutputParamType.STRING
    param_content: str = ""
    optional: bool = False
    loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.DO_NOT_LOAD
    load_from_output_id: int = 0
    loaded: bool = False

    def __init__(self,
                 config: dict,
                 param_name: str,
                 param_type: SkillOutputParamType,
                 param_content: str,
                 optional: bool = False,
                 loading_method: SkillInputLoadingMethod = SkillInputLoadingMethod.DO_NOT_LOAD,
                 load_from_output_id: int = 0,
                 ):
        # Initialization
        self.param_name = param_name
        self.param_type = param_type
        self.param_content = param_content
        self.optional = optional
        self.loading_method = loading_method
        self.load_from_output_id = load_from_output_id
        self.config = config
        return

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
        self.config = config
        self.param_name = param_name
        self.param_type = param_type
        self.param_content = param_content
        self.id = id
