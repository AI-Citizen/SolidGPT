from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *

# To create a code plan for all target files, we should output List<fileName, instruction>
class CreateCodeSolutionV3(WorkSkill):
    #Graph Cache Label
    CODE_PLAN = "code_plan"
    RELATED_FILES = "related_files"

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_CREATE_CODE_SOLUTION
        self.session_id_input = SkillInput(
            "Session ID",
            SkillIOParamCategory.PlainText,
        )
        self.input_user_requirement = SkillInput(
            "User requirement",
            SkillIOParamCategory.PlainText,
        )
        self.input_code_plan = SkillInput(
            "Code plan",
            SkillIOParamCategory.PlainText,
        )
        self.input_related_code_files = SkillInput(
            "Related code files",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.session_id_input)
        self.add_input(self.input_user_requirement)
        self.add_input(self.input_code_plan)
        self.add_input(self.input_related_code_files)
        self.output_code_solution = SkillOutput(
            "Code Solution",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_code_solution)
        self.input_content = None
        self.qdrant_path = ""
        self.code_blocks_str = ""

    def _read_input(self):
        self.input_content = self.input_user_requirement.content
        self.session_id = self.session_id_input.content
        self.code_blocks_str = load_from_text(self.get_input_path(self.input_related_code_files), extension=".txt")

    def execution_impl(self):
        logging.info("Start to Create Code Plan...")
        code_solution = self.__generate_solution()
        self._save_to_result_cache(self.output_code_solution, code_solution)

    def __generate_solution(self):
        code_plan = self.input_code_plan.content
        logging.info("Writting code...")
        logging.info(f"""Related files: {self.code_blocks_str}""")
        code_solution_stream = self.gpt_manager.create_and_chat_with_model(
            prompt=self.__build_writting_code_prompt(),
            gpt_model_label="Code Implement",
            input_message=self.__build_writting_code_input(code_plan=code_plan),
            is_stream=True
        )
        code_solution = ""
        for chunk in code_solution_stream:
            try:
                if chunk.choices[0].delta is not None and chunk.choices[0].delta.content is not None:
                    code_solution += chunk.choices[0].delta.content
                    self.callback_func(code_solution)
            except Exception as e:
                logging.warn(f"Failed to get the delta content with error {e}")
                continue

        # logging.info(f"""Code Solution: {code_solution}""")
        # logging.info("Code Correct...")
        # remediation = code_final_solution = self.gpt_manager.create_and_chat_with_model(
        #     prompt=self.__build_dependency_correct_prompt(),
        #     gpt_model_label="Dependency Correct",
        #     input_message= self.__build_dependency_correct_prompt_input(code_solution=code_solution)
        # )

        # logging.info(f"""Code Remediation: {remediation}""")
        # logging.info("Final Solution...")
        # code_final_solution = self.gpt_manager.create_and_chat_with_model(
        #     prompt=self.__build_final_solution_prompt(),
        #     gpt_model_label="Final Solution",
        #     input_message= self.__build_final_solution_input(remediation= remediation, code_solution=code_solution)
        # )
        return code_solution
    
    def __build_writting_code_prompt(self):
        return """
                NOTICE
                Role: You are a professional engineer, you can use any programming language to implement the code solution baes on {Requirement} and {Code Plan}.
                ATTENTION: Only update the new updated code blocks, NOT THE WHOLE FILE, DON'T output existing code. 
                ATTENTION: Use '##' to SPLIT SECTIONS, not '#'. Output format carefully referenced "Format example". 
                ## Code: {filename} Write code with triple quoto, based on the following list and context.
                1. Implement the code for the {Requirement}, follow the {Code Plan} to implment the final code solution.
                2. You can modify the Existing Code or Create a new code file follow the CODE PLAN
                3. Do your best to implement ONLY USE EXISTING CLASS/FUNCTION/API/OBJECT in Existing Code. IF NO CLASS/FUNCTION/API/OBJECt, IMPLEMENT IT.
                4. If File Affected: New File, highlight with "New File" beside the file name.
                5. Only update then Affected mentioned code in code plan, DON'T update any other code.

                -----
                # Context
                {context}
                -----
                ## Format example
                -----
                ## Code: {filename}
                Description: {description - description what the code block do in detail, where it should be placed, what is the relationship with existing code}
                Placed in: {Show where the code blocks should be placed}
                ```
                ## {filename} 
                ...
                ```
                -----
            """
    
    def __build_writting_code_input(self, code_plan):
        return f"""Requirement: {self.input_user_requirement.content} Code Plan: {code_plan} Existing Code: {self.code_blocks_str} """
    
    def __build_dependency_correct_prompt(self):
        return """
        NOTICE
                Role: You are a professional qa engineer; the main goal is to review and find NEW CODE SOLUTION issues and provide the correct solution base on EXISTIING CODE, syntax and buisness requirement.
                Make sure corrected solution can make the code PEP8 compliant, elegant, modular, easy to read and maintain Python 3.9 code (but you can also use other programming language)
                ATTENTION: Use '##' to SPLIT SECTIONS, not '#'. Output format carefully referenced "Output Format example".

                1.Check Compatibility with Existing Code: Make sure new code solution works well with the existing code, maintaining the same style and function.
                2.Function Use Verification: Ensure functions are used correctly, with proper parameters and for their intended purposes.
                3.Class Use and Initialization: Check that classes are set up and used correctly, according to their design.
                4.Consistent Variable Use: Confirm that variables are used consistently with their defined purpose and type.
                5.Integration Check: Review how new code fits with existing modules and functions, ensuring no unresolved issues.
                6.Refactor and Document According to Standards: Improve new code to fit well with existing code, update documentation to match, and ensure it all meets project guidelines.
                7.Reduce Redundancies: Identify and suggest improvements for any redundant or duplicate code.
                8.Alignment with Requirements: Confirm that the new code meets the defined requirements, ensuring it addresses the intended needs and objectives.

                Ouput Format example
                Issue Code File Name: [File Name]
                Issue Context:
                    - Affected Code Segment: [Code snippet or description]
                    - Relationship to Existing Code: [How it relates or conflicts with existing code]
                Issue Details:
                    - Location: [Line number, Function/Method, Module]
                    - Issue Type: [Incorrect Function Usage, Class Initialization Error, Variable Misuse, etc.]
                    - Detailed Description: [Explain the issue, providing context of existing code and the issue's impact]

                Suggested Fix:
                    - [Provide a specific description or code snippet for fixing the issue, considering the integration with existing code]
        """
    
    def __build_dependency_correct_prompt_input(self, code_solution):
        return f"""
        Please help me review the New Code Solution
        NEW CODE SOLUTION: {code_solution}
        REQUIREMENT: {self.input_content}
        I also provide the Existing Code you can use as reference
        EXISTING CODE: {self.code_blocks_str}
        """
    
    def __build_final_solution_prompt(self):
        return """
                NOTICE
                Role: You are a professional engineer; the main goal is to follow the Code Remediation Guidelines to rewrite Code Solution to PEP8 compliant, elegant, modular, easy to read and maintain Python 3.9 code (but you can also use other programming language)
                ATTENTION: Use '##' to SPLIT SECTIONS, not '#'. Output format carefully referenced "Format example".

                ## Code: {filename} Write code with triple quoto, based on the following list and context.
                1. Adhere strictly to the Code Remediation Guidelines. Any modifications or updates should exclusively target these guidelines and nothing else.
                2. CAREFULLY CHECK THAT YOU DONT MISS ANY NECESSARY CLASS/FUNCTION/FILES MENTIONED IN THIS Code Remediation Guidelines.
                -----
                # Context
                {context}
                -----
                ## Format example
                -----
                ## Code: {filename}
                ```python
                ## {filename}
                ...
                ```
                -----
            """
    
    def __build_final_solution_input(self, remediation, code_solution):
        return f"""Here is the Code Remediation Guidelines {remediation}. 
        Code Solution: {code_solution}"""