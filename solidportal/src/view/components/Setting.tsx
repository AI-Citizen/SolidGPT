import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Input} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './Setting.css';
import Constants from "../utils/Constants";
import DataMappingHelper from "../utils/DataMappingHelper";

const Settings = ({handleCodebaseSync, onBoardProgress, handleNotionSync, visible, setVisible, isSendDisabled}) => {

    const [APIToken, setAPIToken] = useState(localStorage.getItem(Constants.settingConstants.APIToken));
    const [Path, setPath] = useState(localStorage.getItem(Constants.settingConstants.Path));
    const [NotionToken, setNotionToken] = useState(localStorage.getItem(Constants.settingConstants.NotionToken));
    const [NotionPageId, setNotionPageId] = useState(localStorage.getItem(Constants.settingConstants.NotionPageId));
    const [AWSCred, setAWSCred] = useState(localStorage.getItem(Constants.settingConstants.AWSCred));
    const [fileNames, setFileNames] = useState([]);
    const [targetFilePath, setTargetFilePath] = useState([""]);
    const [codebaseChecked, setCodebaseChecked] = useState(true);
    const [notionChecked, setNotionChecked] = useState(false);

    useEffect(() => {
        if (fileNames.length > 0) {
            if(localStorage.getItem(Constants.settingConstants.Path) === null){
                setPath(DataMappingHelper.extractLastFolder(fileNames[0]))
            }
            setTargetFilePath(fileNames);
        } else {
            setTargetFilePath(['']);
        }
        console.log(fileNames[0]);
        console.log(targetFilePath);
    }, [fileNames]);

    window.addEventListener('message', event => {
        const dataReceived = event.data;
        if (dataReceived.action === 'fileOpen' || dataReceived.action === 'fileClose') {
            // Check if fileNames data is present
            setFileNames(dataReceived.fileNames || []);
        }

    });


    const toggleSettings = () => {
        setVisible(!visible);
    };

    const isChecked = (key) => {
        return localStorage.getItem(key) === "true"
    };

    return (
        <div className="settings-container">
            <Button type="primary" icon={<SettingOutlined/>} onClick={toggleSettings} size='large' shape='circle'/>

            {visible && (
                <div className="settings-content">
                    <Input placeholder="OpenAI API Token"
                           value={APIToken || ""}
                           addonBefore={<span className = "settings-addon-before-container">API Token</span>}
                           onChange={(e) => {
                               setAPIToken(e.target.value);
                           }}/>
                    <Input placeholder="Full path, 500 files max"
                           value={Path || ""}
                           addonBefore={<span className = "settings-addon-before-container">Workspace Path</span>}
                           onChange={(e) => {
                               setPath(e.target.value);
                           }}/>
                    <Input placeholder="Notion API Secret"
                           value={NotionToken || ""}
                           addonBefore={<span className = "settings-addon-before-container">Notion Token</span>}
                           onChange={(e) => {
                               setNotionToken(e.target.value);
                           }}/>
                    <Input placeholder="Notion Page Id"
                           value={NotionPageId || ""}
                           addonBefore={<span className = "settings-addon-before-container">Notion Page Id</span>}
                           onChange={(e) => {
                               setNotionPageId(e.target.value);
                           }}/>
        {/*            <Input placeholder="AWS Cred"
                           value={AWSCred}
                           onChange={(e) => {
                               setAWSCred(e.target.value);
                           }}/>*/}

                    <p className="settings-paragraph">Last Indexing Time: {localStorage.getItem(Constants.settingConstants.NotionSyncTime)}</p>
                    <Button type="primary"
                        disabled={isSendDisabled}
                            onClick={() => handleNotionSync(APIToken, NotionToken, NotionPageId)}
                    >Index Notion</Button>

                    <p className="settings-paragraph">Last Indexing Time: {localStorage.getItem(Constants.settingConstants.CodebaseSyncTime)}
                        <br/> {onBoardProgress} </p>
                    <Button type="primary"
                        disabled={isSendDisabled}
                            onClick={() => handleCodebaseSync(APIToken, Path)}
                    >Index Codebase</Button>

                    <Checkbox
                        className='settings-checkbox'
                        checked={notionChecked}
                        onChange={(e) => {
                            console.log(e.target.checked.toString());
                            setNotionChecked(e.target.checked);
                            localStorage.setItem(Constants.settingConstants.NotionChecked, e.target.checked.toString());
                        }}>Chat
                        with Notion</Checkbox>
                    <Checkbox
                        className='settings-checkbox'
                        checked={codebaseChecked}
                        onChange={(e) => {
                            console.log(e.target.checked.toString());
                            setCodebaseChecked(e.target.checked);
                            localStorage.setItem(Constants.settingConstants.CodebaseChecked, e.target.checked.toString());
                        }}>Chat
                        with Codebase</Checkbox>
                </div>
            )}
        </div>
    );
};

export default Settings;
