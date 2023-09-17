import styles from "./UserInputView.module.css";
import {Button, FloatButton, Input, Select} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useState} from "react";


const UserInputView = () => {
    const [selectedGraphType, setSelectedGraphType] = useState("");
    const [openAIKey, setOpenAIKey] = useState("");
    const [notionKey, setNotionKey] = useState("");
    const [notionID, setNotionID] = useState("");
    const [repoRootFolder, setRepoRootFolder] = useState("");
    const [userRequirement, setUserRequirement] = useState("");

    const handleGraphTypeSelectChange = (e) => {
        setSelectedGraphType(e.target.value);
    };
    const handleOpenAIKeyInputChange = (event) => {
        // Update the state with the new input value
        setOpenAIKey(event.target.value);
    };
    const handleNotionKeyInputChange = (event) => {
        // Update the state with the new input value
        setNotionKey(event.target.value);
    };
    const handleNotionIDInputChange = (event) => {
        // Update the state with the new input value
        setNotionID(event.target.value);
    };
    const handleRepoRootFolderInputChange = (event) => {
        // Update the state with the new input value
        setRepoRootFolder(event.target.value);
    };
    const handleUserRequirementInputChange = (event) => {
        // Update the state with the new input value
        setUserRequirement(event.target.value);
    };

    return (<div className={styles.userinputview}>
        <div className={styles.producttitlecomponent}>
            <b className={styles.solidgpt}>SolidGPT</b>
        </div>
        <div>
            <div>
                <TextArea className={styles.requirement} bordered={false}
                          value={userRequirement}
                          onChange={handleUserRequirementInputChange}
                          autoSize={{minRows: 20, maxRows: 20}}
                          allowClear placeholder="Input Your Requirement:"/>
            </div>
        </div>
        <div>
            <div>
                <TextArea className={styles.repofolderpath} bordered={false}
                          value={repoRootFolder}
                          onChange={handleRepoRootFolderInputChange}
                          autoSize={{minRows: 5, maxRows: 5}}
                          placeholder="Upload Your Repo Root Folder:"/>
            </div>
        </div>
        <div>
            <div><TextArea className={styles.notionpageid} bordered={false}
                           value={notionID}
                           onChange={handleNotionIDInputChange}
                           autoSize={{minRows: 2, maxRows: 2}} placeholder="Notion Page ID:"/></div>
        </div>
        <div>
            <div><TextArea className={styles.notionkey} bordered={false}
                           value={notionKey}
                           onChange={handleNotionKeyInputChange} autoSize={{minRows: 2, maxRows: 2}}
                           placeholder="Notion API Key:"/></div>
        </div>
        <div>
            <div><TextArea className={styles.openaikey} bordered={false}
                           value={openAIKey}
                           onChange={handleOpenAIKeyInputChange}
                           autoSize={{minRows: 2, maxRows: 2}} placeholder="OpenAI API Key:"/></div>
        </div>
        <div>
            <div><select className={styles.graphtype} onChange={handleGraphTypeSelectChange} value={selectedGraphType}>
                <option value="" disabled hidden>
                    Graph Type
                </option>
                <option value="Engineer Manager - Rampup Project">Engineer Manager - Rampup Project</option>
                <option value="Engineer Manager - Get Solution">Engineer Manager - Get Solution</option>
            </select></div>
        </div>
        <div>
            <Button className={styles.startbutton}>Start</Button>
        </div>
    </div>);
};

export default UserInputView;
