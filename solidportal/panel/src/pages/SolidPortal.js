import UserInputView from "../components/UserInputView";
import styles from "./SolidPortal.module.css";
import {useState} from "react";
import {Button, FloatButton} from "antd";
import {CloseCircleOutlined, RightCircleOutlined} from "@ant-design/icons";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";


const SolidPortal = () => {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [floatIcon, setFloatIcon] = useState(< CloseCircleOutlined/>);
    const [nodeSelected, setNodeSelected] = useState("");
    const toggleIcon = () => {
        if (!showLeftPanel) {
            setFloatIcon(< CloseCircleOutlined/>);
        } else {
            setFloatIcon(<RightCircleOutlined/>);
        }
    };
    const items = [
        'Item 1',
        'Item 2',
        'Item 3',
        // Add more items here
    ];
    const handleListNodeClick = (parameter) => {
        setNodeSelected(parameter);
        console.log(`Button clicked with parameter: ${parameter}`);
    };
    const setListNodeButtonType = (text) => {
        if (nodeSelected === text) {
            return "primary"
        } else {
            return "dashed"
        }
    };

    function ListNode({text}) {
        return (
            <Button onClick={() => handleListNodeClick(text)}
                    className={styles.node}
                    type={setListNodeButtonType(text)}>
                current node name {text}</Button>
        );
    }

    const [value, setValue] = useState("**Hello world!!!**");
    return (
        <div className={styles.solidportal}>
            {showLeftPanel && <UserInputView/>}
            <FloatButton type="default" icon={floatIcon} style={{left: 20}}
                         onClick={() => {
                             toggleIcon()
                             setShowLeftPanel(!showLeftPanel)
                         }}/>
            <div className={styles.mainview}>
                <div className={styles.actionpanel}/>
                <div className={styles.actionbuttons}>
                    <Button className={styles.continueactiobutton}>Continue</Button>
                    <Button className={styles.continueactiobutton}>Stop</Button>
                    <Button className={styles.continueactiobutton}>Notion Sync</Button>
                    <Button className={styles.continueactiobutton}>Notion Open</Button>
                </div>
                <div className={styles.statusnodelist}>
                    {items.map((item, index) => (
                        <ListNode key={index} text={item}/>
                    ))}
                </div>
                <div className={styles.markdowneditor}>
                    <div className="container" style={{ width: '100%'}}>
                        <MDEditor
                            style={{ minHeight: '710px', width: '100%'}}
                            value={value}
                            onChange={setValue}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolidPortal;
