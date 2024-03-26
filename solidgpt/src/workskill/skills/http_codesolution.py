import shutil

from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import *
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *


# To create a code plan for all target files, we should output List<fileName, instruction>
class HTTPCodeSolution(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_HTTP_SOLUTION
        self.input_user_requirement = SkillInput(
            "User requirement",
            SkillIOParamCategory.PlainText,
        )

        self.add_input(self.input_user_requirement)

        self.output_path = SkillOutput(
            "HTTP Solution Path",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_path)
        self.input_content = None
        # self.collection_name = ""
        self.schema_dict = {}
        self.need_modify = False
        self.session_id = None

    def _read_input(self):
        self.input_content = self.input_user_requirement.content
        self.session_id = self.get_uuid()

    def execution_impl(self):
        logging.info("Start to Generate HTTP Code...")
        self.remove_dir()
        self.copy_templates()
        self.create_schema()
        # self.modify_dir_name()
        if self.need_modify:
            self.modify_todo_create()
            self.modify_todo_update()
        dst_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture")
        self._save_to_result_cache(self.output_path, dst_path)

    def copy_templates(self):
        src = os.path.join(SRC_DIR, "tools", "templates", "aws-python-http-api-with-dynamodb")
        dst = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture")
        shutil.copytree(src, dst)

    def create_schema(self):
        schema = self.gpt_manager.create_and_chat_with_model(
            prompt=SCHEMA_DESIGN_PRINCIPLE,
            gpt_model_label="HTTP Collection",
            input_message=f"{self.input_content}. Only output the schema, do not output anything else including introductions and explanations.",
        )
        # print(schema)
        for line in schema.split("\n"):
            if ":" not in line:
                continue
            tokens = line.split(":")
            key = tokens[0].strip()
            val = tokens[1].strip()
            if key == "##Collection##":
                continue
            else:
                self.schema_dict[key] = val
        if set(self.schema_dict.keys()) != {"'createdAt'", "'updatedAt'", "'id'"}:
            self.need_modify = True


    def modify_yml(self):
        # filelist = os.listdir(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", self.collection_name))
        # path1 = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", "serverless.yml")
        #
        # def change_todos(dest_path):
        #     with open(dest_path, 'r') as file:
        #         # Reading the content of the file
        #         # using the read() function and storing
        #         # them in a new variable
        #         data = file.read()
        #
        #         # Searching and replacing the text
        #         # using the replace() function
        #         data = data.replace("todos", self.collection_name)
        #
        #         # Opening our text file in write only
        #     # mode to write the replaced content
        #     with open(dest_path, 'w') as file:
        #         # Writing the replaced data in our
        #         # text file
        #         file.write(data)
        #
        # change_todos(path1)
        # for file2 in filelist:
        #     path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", self.collection_name, file2)
        #     change_todos(path)
        pass

    def modify_dir_name(self):
        # src_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", "todos")
        # dest_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", self.collection_name)
        # shutil.move(src_path, dest_path)
        pass

    def modify_todo_create(self):
        search_text = """'id': str(uuid.uuid1()),
        'text': data['text'],
        'checked': False,
        'createdAt': timestamp,
        'updatedAt': timestamp,"""
        replace_list = []
        for k, v in self.schema_dict.items():
            replace_list.append(f"{k}: {v}")
        replace_text = "\n".join(replace_list)
        dest_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", "todos", "create.py")
        with open(dest_path, 'r') as file:

            data = file.read()
            data = data.replace(search_text, replace_text)
        with open(dest_path, 'w') as file:
            file.write(data)

    def modify_todo_update(self):
        replace1 = []
        replace2 = []
        replace3 = []
        replace4 = []
        for k, v in self.schema_dict.items():
            if v != "timestamp," and v != "str(uuid.uuid1()),":
                replace1.append(f"{k} not in data")
                replace2.append(f"'#{k[1:-1]}': {k},")
                replace3.append(f"':{k[1:-1]}': {v}")
                replace4.append(f"'#{k[1:-1]} = :{k[1:-1]}, '")
        # print(replace3)
        replace_text1 = " or ".join(replace1)
        replace_text2 = "\n".join(replace2)
        replace_text3 = "\n".join(replace3)
        replace4.append("'updatedAt = :updatedAt'")
        replace_text4 = "\n".join(replace4)
        dest_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture", "todos", "update.py")
        with open(dest_path, 'r') as file:
            # Reading the content of the file
            # using the read() function and storing
            # them in a new variable
            data = file.read()

            # Searching and replacing the text
            # using the replace() function
            search_text1 = "'text' not in data or 'checked' not in data"
            data = data.replace(search_text1, replace_text1)
            search_text2 = "'#todo_text': 'text',"
            data = data.replace(search_text2, replace_text2)
            search_text3 = """':text': data['text'],
          ':checked': data['checked'],"""
            data = data.replace(search_text3, replace_text3)
            search_text4 = """'SET #todo_text = :text, '
                         'checked = :checked, '
                         'updatedAt = :updatedAt'"""
            # Opening our text file in write only
            data = data.replace(search_text4, f"'SET {replace_text4[1:]}")
        # mode to write the replaced content
        with open(dest_path, 'w') as file:
            file.write(data)

    def remove_dir(self):
        if os.path.exists(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture")):
            shutil.rmtree(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture"))
        print(f'path exist: {os.path.exists(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture"))}')
        return

    @staticmethod
    def get_uuid():
        return str(uuid.uuid4().hex)
