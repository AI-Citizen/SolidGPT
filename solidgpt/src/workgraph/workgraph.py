"""everything in workgraph can be considered as global"""
import os
import time
from solidgpt.src.saveload.saveload import *
# from solidgpt.src.tools.notion.notionactions import NotionActions
from solidgpt.src.workgraph.displayresult import DisplayResult


class WorkGraph:

    nodes: list[WorkNode] = []
    node_map: dict[str, WorkNode] = {}
    output_map: dict[int, SkillOutput] = {}
    output_id_to_node_map: dict[int, WorkNode] = {}
    display_result: DisplayResult
    notion = None
    cache = {}
    callback_map: dict = {}
    custom_data: dict = {}

    def __init__(self, output_directory_path_override: str = "", output_id = None):
        # need to manually initialize here
        self.nodes = []
        self.node_map = {}
        self.output_map = {}
        self.output_id_to_node_map = {}
        self.callback_map = {}
        self.display_result = DisplayResult()
        self.output_directory_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, output_id or time.strftime("%Y%m%d%H%M%S"))
        if output_directory_path_override:
            self.output_directory_path = os.path.abspath(output_directory_path_override)
        return

    def add_node(self, node: WorkNode):
        node.graph_cache = self.cache
        self.nodes.append(node)

    def init_node_dependencies(self):

        # clear node map and output map
        self.node_map.clear()
        self.output_map.clear()
        self.output_id_to_node_map.clear()

        for node in self.nodes:
            # add node to node map
            self.node_map[node.node_id] = node

            # initialize display_result for children
            node.display_result = self.display_result
            node.skill.display_result = self.display_result

            # intialize callback func for skills
            if node.skill.name in self.callback_map:
                node.skill.callback_func = self.callback_map.get(node.skill.name, None)

            # keep a graph reference in skill
            node.skill.graph = self

            # create directory for node
            node_directory_path = os.path.join(self.output_directory_path,
                                               (node.skill.name + "_" + str(node.node_id)).replace(" ", "_"))
            if not os.path.exists(node_directory_path):
                # Create the output folder
                os.makedirs(node_directory_path)
                print(f"Directory '{node_directory_path}' created.")

            # add output to output map
            for o in node.skill.outputs:
                # initialize output paths
                o.param_path = os.path.join(node_directory_path, (o.param_name + " " + str(o.id)).replace(" ", "_"))
                # output can be consumed by inputs of other nodes
                if o.id >= 0:
                    self.output_map[o.id] = o
                    self.output_id_to_node_map[o.id] = node

        # second iteration after output map has been initialized
        for node in self.nodes:
            # add output dependencies for node
            for i in node.skill.inputs:
                if i.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID:
                    if i.load_from_output_id == -1:
                        print("Error, " + i.param_name + ": cannot load from output id: -1.")
                        continue
                    node.output_id_dependencies.add(i.load_from_output_id)

                    # add current node to next_node_ids of the output node
                    if i.load_from_output_id not in self.output_map:
                        print("Error, input %s: loading from an invalid output id %d."
                              % (i.param_name, i.load_from_output_id))
                        continue
                    output_node = self.output_id_to_node_map[i.load_from_output_id]
                    if output_node.node_id == node.node_id:
                        print("Error, " + i.param_name + ": cannot load from its own output.")
                        continue
                    output_node.next_node_ids.add(node.node_id)
                    i.skill_output = self.output_map[i.load_from_output_id]

        if self.__is_circular():
            print_error_message("Circular graph detected. Terminating program...")
            exit(1)
        return

    def execute(self):
        logging.info("Executing SolidGPT...")
        first_nodes = []
        for node in self.nodes:
            if len(node.output_id_dependencies) == 0:
                first_nodes.append(node)

        if len(first_nodes) == 0:
            print_error_message("Cannot execute graph, no node can be executed.")

        for node in first_nodes:
            self.__execute_node(node)
        logging.info(f"SolidGPT execution completed. All results are saved in {self.output_directory_path}")
        

    def __execute_node(self, node: WorkNode):
        if node.can_execute():
            # execute skill
            node.skill.execute()
            # wait for potential node pause
            self.__node_pause(node)
            # notify other nodes
            for next_node_id in node.next_node_ids:
                next_node = self.node_map[next_node_id]
                for o in node.skill.outputs:
                    next_node.output_id_dependencies.remove(o.id)
                self.__execute_node(next_node)

    def __node_pause(self, node: WorkNode):
        if node.manual_review_result:
            time.sleep(0.25)
            print("\nPlease review result generated by %s skill in node %s"
                  % (node.skill.name, str(node.node_id)))
            notion_file_opened = False
            while True:
                user_input = input("Execution is halted. Please specify an action, then press Enter. "
                                   "To view all available actions, enter 'help':")

                if same_string(user_input, "help"):
                    help_msg: str = "{:<18}{}\n".format("help", "Show this help message.") + \
                                    "{:<18}{}\n".format("continue", "Continue execution.") + \
                                    "{:<18}{}\n".format("stop", "Stop program.") + \
                                    "{:<18}{}\n".format("path", "Show the path of this result.") + \
                                    "{:<18}{}\n".format("notion-open", "Open the markdown result in notion.") + \
                                    "{:<18}{}\n".format("notion-sync", "Sync the notion result, save it as new output.")
                    print(help_msg)
                    continue
                elif same_string(user_input, "continue"):
                    print("Continuing execution...")
                    break
                elif same_string(user_input, "stop"):
                    print("Exiting the program...")
                    exit(0)
                elif same_string(user_input, "path"):
                    print(os.path.abspath(os.path.dirname(node.skill.outputs[0].param_path)))
                    continue
                elif same_string(user_input, "notion-open"):
                    if self.notion is None:
                        # self.notion = NotionActions()
                        pass
                    if not notion_file_opened:
                        skill_outputs = node.skill.outputs
                        if len(skill_outputs) > 0:
                            first_output = skill_outputs[0]
                            category = first_output.param_category
                            output_path = first_output.param_path
                            print(f"!!!!!!!{type(category)} {category}")
                            if category == SkillIOParamCategory.ProductRequirementsDocument or \
                                    category == SkillIOParamCategory.BusinessRequirementsDocument or \
                                    category == SkillIOParamCategory.HighLevelDesignDocument or \
                                    category == SkillIOParamCategory.PlainText or \
                                    category == SkillIOParamCategory.KanbanBoard:

                                output_md_filepath = add_extension_if_not_exist(output_path, ".md")
                                self.notion.process_markdown_and_upload(output_md_filepath)
                            else:
                                print(f"Notion does not support {SkillIOParamCategory.PlainText} output.")
                                continue
                        else:
                            print("Notion does not support skill with no outputs.")
                            continue
                        notion_file_opened = True
                    else:
                        print("File already opened in Notion.")
                    continue
                elif same_string(user_input, "notion-sync"):
                    if notion_file_opened:
                        skill_outputs = node.skill.outputs
                        first_output = skill_outputs[0]
                        category = first_output.param_category
                        output_path = first_output.param_path
                        if category == SkillIOParamCategory.ProductRequirementsDocument or \
                                category == SkillIOParamCategory.BusinessRequirementsDocument or \
                                category == SkillIOParamCategory.HighLevelDesignDocument or \
                                category == SkillIOParamCategory.PlainText or \
                                category == SkillIOParamCategory.KanbanBoard:
                            output_md_file_dir = os.path.dirname(output_path)
                            output_md_file_name = os.path.basename(output_path)
                            self.notion.sync_from_notion(output_md_file_dir, output_md_file_name)
                        print("Notion file synced.")
                    else:
                        print("notion-open command needs to be used first.")
                    continue
                else:
                    print("Invalid input entered.")
                    continue

    def save_data(self, filename: str = "data.json", generate_debug_info: bool = False):
        save_data = generate_save_data_from_nodes(self.nodes, generate_debug_info)
        save_to_json(save_data, filename)
        return

    def load_data(self, filename: str = "data.json"):
        loaded_data = load_from_json(filename)
        self.nodes.clear()
        self.nodes = load_save_data_to_nodes(loaded_data)
        self.init_node_dependencies()
        return

    def __is_circular(self):
        visited = {node_id: False for node_id in self.node_map}
        stack = {node_id: False for node_id in self.node_map}

        # check every node because the graph might be disjoint
        for node_id in self.node_map:
            if not visited[node_id]:
                if self.__has_cycle(node_id, visited, stack):
                    return True

        return False

    def __has_cycle(self, current_node_id, visited, stack):
        # mark the current node as visited
        visited[current_node_id] = True
        # add the current node to the stack representing the current path
        stack[current_node_id] = True

        # visit all the neighbors of the current node
        for neighbor_id in self.node_map[current_node_id].next_node_ids:
            # if the neighbor is not visited, visit it
            if not visited[neighbor_id]:
                if self.__has_cycle(neighbor_id, visited, stack):
                    return True
            # if the neighbor is already in the current path, we have found a cycle
            elif stack[neighbor_id]:
                return True

        # remove the current node from the current path stack
        stack[current_node_id] = False
        return False
