import {useEffect, useRef, useState} from "react";
import ChatElement from "./ChatElement";
import Avatar from "./Avatar";
import Message from "./Message";
import "./Home.css";
import "../utils/DataMappingHelper"

const solidGPTIcon = require("../static/img/solidgpticon.svg");
import {AutoComplete, Button} from "antd";
import {ReloadOutlined, SendOutlined} from '@ant-design/icons';
import React from 'react';
import endPoints from "../utils/endPoints";
import {ApiHelper} from "../utils/ApiHelper";
import config from "../utils/config";
import FileList from "./FileList"
import Setting from "./Setting";
import Constants from "../utils/Constants";
import DataMappingHelper from "../utils/DataMappingHelper";

function Home() {
    const setColor = () => {
        let body = document.querySelector('body');
        body?.style.setProperty('--secondary-bg-color', config.FontColor);
        body?.style.setProperty('--bg-color', config.ChatBoxColor);
        body?.style.setProperty('--primary-color', config.ChatBoxColor);
        body?.style.setProperty('--text-color', config.ChatBoxColor);
        body?.style.setProperty('--font', config.Font);
    }
    setColor();
    const [messageList, setMessageList] = useState<any[]>([]);
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const notionDefaultList = () =>{
        if(localStorage.getItem(Constants.onBoardProject.NotionFileList) === null){
            return [];
        }
        let list = JSON.parse(JSON.parse(localStorage.getItem(Constants.onBoardProject.NotionFileList)!));
        return list.map(item => item[1]);
    };
    const [notionList, setNotionList] = useState(notionDefaultList);
    const codebaseDefaultList = () =>{
        if(localStorage.getItem(Constants.onBoardProject.CodeBaseFileList) === null){
            return [];
        }
        let list = JSON.parse(localStorage.getItem(Constants.onBoardProject.CodeBaseFileList)!);
        return DataMappingHelper.removeBasePath(list);
    };
    const [codebaseList, setCodebaseList] = useState(codebaseDefaultList);
    const [optionsCommandNotion, setOptionsCommandNotion] =
        useState(notionList as string[]);
    const [optionsCommandCodeBase, setOptionsCommandCodeBase] =
        useState(codebaseList as string[]);
    const [filesList, setFilesList] = useState<string[]>([]);
    const [backendStatus, setBackendStatus] = useState(false)
    const pollingInterval = 1000;

    useEffect(() => {
        if(!backendStatus) {
            const intervalId = setInterval(async () => {
                try {
                    const response = await ApiHelper.getRequest(endPoints.InitCheck);
                    if (response.status === 200) {
                        console.log(response.data);
                        addMessage(false, "**Initialization done**", true);
                        setBackendStatus(true);
                        setIsSendDisabled(false);
                        localStorage.setItem(Constants.settingConstants.CodebaseChecked, "true");
                        localStorage.setItem(Constants.settingConstants.NotionChecked, "false");
                    } else {
                        addMessage(false, "**Server error happen. Please restart SolidGPT**", true);
                        setBackendStatus(false);
                    }
                } catch (e) {
                    addMessage(false, "**Initializing...**", true);
                    setBackendStatus(false);
                }
            }, pollingInterval);
            return () => clearInterval(intervalId);
        }
    }, [backendStatus, pollingInterval]);

    useEffect(() => {
        // always scroll to show last message in bottom
        if (listContainerRef.current) {
            listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
        }
    }, [messageList]);
    const addMessage = (isUser: any, message: any, updatePrevious: boolean = false) => {
        const newMessage = {
            isUser: isUser,
            message: message,
        };
        setMessageList(prevMessageList => {
            console.log(JSON.stringify(prevMessageList[prevMessageList.length - 1]))
            if (prevMessageList.length > 0) {
                if (JSON.stringify(prevMessageList[prevMessageList.length - 1])
                    === Constants.constants.waitHintStringify) {
                    prevMessageList.pop();
                };
                if (updatePrevious){
                    prevMessageList.pop();
                };
            };
            return [...prevMessageList, newMessage]
        });
    };
    const listContainerRef = useRef<any>(null);
    const [inputValue, setInputValue] = useState('');
    const [isSendDisabled, setIsSendDisabled] = useState(true);
/*    const [fileNames, setFileNames] = useState([]);
    const [targetFilePath, setTargetFilePath] = useState([""]);*/
    const [onBoardProgress, setOnBoardProgress] = useState("");

/*    useEffect(() => {
        if (fileNames.length > 0) {
            setTargetFilePath(fileNames);
        } else {
            setTargetFilePath(['']);
        }
        console.log(fileNames);
        console.log(targetFilePath);
    }, [fileNames]);*/

    const [status, setStatus] = useState(false);
    useEffect(() => {
        const requestBody = JSON.stringify({
            graph_id: localStorage.getItem(Constants.onBoardProject.GraphId)
        });
        if (status) {
            setIsSendDisabled(true);
            const intervalId = setInterval(async () => {
                try {
                    const response = await ApiHelper.postRequest(endPoints.StatusGraph, requestBody);

                    if (response.status === 200) {
                        console.log(response.data);
                        if (response.data.status === 1) {
                            if (response.data.graph === "Onboard Repo Graph") {
                                setOnBoardProgress("Onboard Files " + response.data.progress.current + "/" + response.data.progress.total)
                            }else if(response.data.graph === "notion chat api Graph" || response.data.graph === "code chat api Graph"){
                                if (response.data.progress !== null){
                                    addMessage(false, response.data.progress.current_content ,true);
                                };
                            };
                        } else if (response.data.status === 2) {
                            setStatus(false);
                            setIsSendDisabled(false);
                            if (response.data.graph === "Onboard Repo Graph") {
                                if (response.data.payload === null) {
                                    addMessage(false, response.data.result);
                                    return;
                                }
                                const result = JSON.stringify(response.data.payload);
                                setCodebaseList(DataMappingHelper.removeBasePath(response.data.payload));
                                localStorage.setItem(Constants.onBoardProject.CodeBaseFileList, result);
                                setOptionsCommandCodeBase(DataMappingHelper.removeBasePath(response.data.payload));
                                localStorage.setItem(Constants.settingConstants.CodebaseSyncTime, DataMappingHelper.getCurrentTimeString());
                            } else if (response.data.graph === "Notion Embed Graph") {
                                const result = JSON.stringify(response.data.payload);
                                setNotionList(response.data.payload);
                                console.log(response.data.payload);
                                localStorage.setItem(Constants.onBoardProject.NotionFileList, result);
                                setOptionsCommandNotion(JSON.parse(response.data.payload).map(item => item[1]));
                                localStorage.setItem(Constants.settingConstants.NotionSyncTime, DataMappingHelper.getCurrentTimeString());
                            }else if (response.data.graph === "notion chat api Graph" || response.data.graph === "code chat api Graph"){
                                addMessage(false, response.data.result,true);
                                if (response.data.graph === "notion chat api Graph" &&
                                    localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "true"){
                                    setIsSendDisabled(true);
                                    await codeChatApiCall();
                                }
                                return;
                            }
                            addMessage(false, response.data.result);
                                }
                        // If response data status is other than 1 or 2, then it is an internel error
                        else {
                            addMessage(false, Constants.constants.error + "[Error ID: 1]");
                            setStatus(false);
                            setIsSendDisabled(false);
                        }
                    } else {
                        addMessage(false, Constants.constants.error + "[Error ID: 2]");
                        setStatus(false);
                        setIsSendDisabled(false);
                    }
                } catch (e) {
                    console.log((e as Error).message);
                    addMessage(false, Constants.constants.error + "[Error ID: 3]");
                    setStatus(false);
                    setIsSendDisabled(false);
                }

            }, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [status, pollingInterval]);

    const hintDisplayNum = 10
    const handleChange = (value: string) => {
        setInputValue(value);
        if (value.endsWith("@") ) {
            setShowDropdown(true);
        }
        if (showDropdown || value.endsWith("@")) {
            const lastIndex = value.lastIndexOf('@');
            const subVal = value.substring(lastIndex+1, value.length);
            if (localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "true"
                && localStorage.getItem(Constants.settingConstants.NotionChecked) === "false") {
                setOptions(DataMappingHelper.getInputHintValue(subVal, optionsCommandCodeBase, Constants.onBoardProject.CodeBaseFileList,hintDisplayNum));
            } else if (localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "false"
                && localStorage.getItem(Constants.settingConstants.NotionChecked) === "true") {
                setOptions(DataMappingHelper.getInputHintValue(subVal, optionsCommandNotion, Constants.onBoardProject.NotionFileList,hintDisplayNum));
            } else if (localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "true"
                && localStorage.getItem(Constants.settingConstants.NotionChecked) === "true") {
                setOptions(DataMappingHelper.getInputHintValue(subVal, optionsCommandCodeBase, Constants.onBoardProject.CodeBaseFileList,hintDisplayNum/2).concat(DataMappingHelper.getInputHintValue(subVal, optionsCommandNotion, Constants.onBoardProject.NotionFileList,hintDisplayNum/2)));
            } else {
                setOptions([]);
            }

        }
    };


    function addSelectedValue(value: string) {
        if(value.length !== 0){
            if(!filesList.includes(value.trim())){
                setFilesList([...filesList, value.trim()]);
            }
        }
    }

    const handleSelect = (value: string) => {
        console.log('Selected:', value);
        // Implement logic to insert selected command into the text area
        const lastIndex = inputValue.lastIndexOf('@');
        const subVal = inputValue.substring(0, lastIndex);
        setInputValue(`${subVal}`);
        addSelectedValue(value)
        setShowDropdown(false);
      };


    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            // Call the function to handle the button click
            await handleSendClick();
        }
        else if (event.keyCode === 8) { // check if backspace triggered
            if (inputValue.endsWith("@") || inputValue.trim() === '') {
                setShowDropdown(false);
            }
        }
    };

    const handleSendClick = async () => {
        if (inputValue === "" || isSendDisabled) {
            return;
        }
        addMessage(true, inputValue);
        addMessage(false, Constants.constants.waitHint);
        setInputValue("");
        setIsSendDisabled(true);
  /*      console.log(
            DataMappingHelper.mapData(filesList,
            JSON.parse(JSON.parse(localStorage.getItem(Constants.onBoardProject.NotionFileList))),
            JSON.parse(localStorage.getItem(Constants.onBoardProject.CodeBaseFileList)))
        )*/
        await getAction()
    };

    const avatar = (isUser: any) => {
        if (isUser) {
            return config.UserAvatar;
        } else {
            return config.Avatar;
        }
    }

    const cleanChat = async () => {
        ApiHelper.postRequest(endPoints.CleanHistory, JSON.stringify({}));
    };

    const clearMessage = async () => {
        setMessageList([]);
        setStatus(false);
        await cleanChat();
    };

/*
    window.addEventListener('message', event => {
        const dataReceived = event.data;
        if (dataReceived.action === 'fileOpen' || dataReceived.action === 'fileClose') {
            // Check if fileNames data is present
            setFileNames(dataReceived.fileNames || []);
        }

    });
*/

    window.postMessage({type: 'webviewReady'});

    const handleCodebaseSync = async (APIToken, Path) => {
        console.log('Button clicked from App with parameters:', APIToken, Path);
        try {
            const requestBody = JSON.stringify({
                openai_key: APIToken,
                base_path: Path
            });
            const response = await ApiHelper.postRequest(endPoints.OnBoardProject, requestBody);
            const data = response.data;
            if (response.status === 200) {
                setIsSendDisabled(false);
                console.log(data);
                addMessage(false, data.message);
                localStorage.setItem(Constants.settingConstants.APIToken, APIToken)
                localStorage.setItem(Constants.settingConstants.Path, Path)
                localStorage.setItem(Constants.onBoardProject.GraphId, data.graph_id)
                setStatus(true)
            } else {
                addMessage(false, Constants.constants.onBoardError + "[Error ID: 4]");
                setIsSendDisabled(false);
            }
        } catch (error) {
            addMessage(false, Constants.constants.error + "[Error ID: 5]");
            setIsSendDisabled(false);
        }
    };

    const handleNotionSync = async (APIToken, NotionToken, NotionPageId) => {
        try {
            const requestBody = JSON.stringify({
                onboarding_id: "placeholder",
                openai_key: APIToken,
                workspace_token: NotionToken,
                top_level_page_id: NotionPageId,
            });
            const response = await ApiHelper.postRequest(endPoints.Notionembed, requestBody);
            const data = response.data;
            if (response.status === 200) {
                setIsSendDisabled(false);
                console.log(data);
                addMessage(false, data.message);
                localStorage.setItem(Constants.settingConstants.APIToken, APIToken)
                localStorage.setItem(Constants.settingConstants.NotionToken, NotionToken)
                localStorage.setItem(Constants.settingConstants.NotionPageId, NotionPageId)
                localStorage.setItem(Constants.onBoardProject.GraphId, data.graph_id)
                setStatus(true)
            } else {
                addMessage(false, Constants.constants.onBoardError + "[Error ID: 6]");
                setIsSendDisabled(false);
            }
        } catch (error) {
            addMessage(false, Constants.constants.error + "[Error ID: 7]");
            setIsSendDisabled(false);
        }
    }

    async function getAction() {
        if (localStorage.getItem(Constants.settingConstants.NotionChecked) === "true"){
            await notionChatApiCall()
        }
        if (localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "true" &&
            localStorage.getItem(Constants.settingConstants.NotionChecked) === "false"){
            await codeChatApiCall()
        }
        if (localStorage.getItem(Constants.settingConstants.CodebaseChecked) === "false" &&
            localStorage.getItem(Constants.settingConstants.NotionChecked) === "false"){
            addMessage(false, Constants.constants.errorHint + "[Error ID: 8]");
            setIsSendDisabled(false)
        }
    }

    const codeChatApiCall = async () => {
        try {
            const requestBody = JSON.stringify({
                graph_id: localStorage.getItem(Constants.onBoardProject.GraphId),
                openai_key: localStorage.getItem(Constants.settingConstants.APIToken),
                requirement: inputValue,
                scope: DataMappingHelper.mapData(filesList,
                    [],
                    JSON.parse(localStorage.getItem(Constants.onBoardProject.CodeBaseFileList) ?? "")).codebaseItems
            });
            const response = await ApiHelper.postRequest(endPoints.CodeChatAPI, requestBody);
            const data = response.data;
            if (response.status === 200) {
                setIsSendDisabled(false);
                console.log(data);
                addMessage(false, data.message);
                setStatus(true)
            } else {
                addMessage(false, Constants.constants.error + "[Error ID: 9]");
                setIsSendDisabled(false);
            }
        } catch (error) {
            addMessage(false, Constants.constants.error + "[Error ID: 10]");
            setIsSendDisabled(false);
        }
    }

    const notionChatApiCall = async () => {
        try {
            const requestBody = JSON.stringify({
                graph_id: localStorage.getItem(Constants.onBoardProject.GraphId),
                openai_key: localStorage.getItem(Constants.settingConstants.APIToken),
                requirement: inputValue,
                scope:DataMappingHelper.mapData(filesList,
                    JSON.parse(JSON.parse(localStorage.getItem(Constants.onBoardProject.NotionFileList) ?? "")),
                    []).notionItems
            });
            const response = await ApiHelper.postRequest(endPoints.NotionChatApI, requestBody);
            const data = response.data;
            if (response.status === 200) {
                setIsSendDisabled(false);
                console.log(data);
                addMessage(false, data.message);
                setStatus(true)
            } else {
                addMessage(false, Constants.constants.error + "[Error ID: 11]");
                setIsSendDisabled(false);
            }
        } catch (error) {
            addMessage(false, Constants.constants.error + "[Error ID: 12]");
            setIsSendDisabled(false);
        }
    }
    const [settingVisible, setSettingVisible] = useState(true);
    return (
        <div className="home-style">
            <div className="div-p">
                <div className="main">
                    <div className="div-text-primary">
                        <div className="div-flex-margin-wrapper">
                            <ul ref={listContainerRef} className="list-container">
                                {messageList.map((item, index) => (
                                    <li key={index} className="list-item">
                                        <ChatElement isUser={item.isUser} avatar={true}>
                                            <Avatar src={avatar(item.isUser)}/>
                                            <Message is_table={false}
                                                     message={item.message}
                                                     allow_html={true}/>
                                        </ChatElement>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="div-mt">
                            <div className="form">
                                <div className="file-list">
                                    <FileList
                                        files={filesList}
                                        setFiles={setFilesList}/>
                                </div>
                                <AutoComplete className="input"
                                            dropdownStyle={{backgroundColor: "#3c3c3c"}}
                                              size="large"
                                              value={inputValue}
                                              onChange={handleChange}
                                              onSelect={handleSelect}
                                              open={showDropdown}
                                              options={options}
                                              onKeyDown={handleKeyPress}
                                              onClick={() => setSettingVisible(false)}
                                              placeholder= "Use @ to select the specific files or code you'd like to talk"
                                />
                            </div>
                            <Button type="primary" size="large"
                                    style={{cursor: isSendDisabled ? 'not-allowed' : 'pointer'}}
                                    onClick={handleSendClick}
                                    disabled={isSendDisabled}
                                    icon={<SendOutlined/>}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="config-container">
                <div className="setting">
                    <Setting handleCodebaseSync={handleCodebaseSync}
                            onBoardProgress={onBoardProgress}
                            handleNotionSync={handleNotionSync}
                            visible={settingVisible}
                            setVisible={setSettingVisible}
                            isSendDisabled={isSendDisabled}/>
                </div>
                <div className="floating-button-container">
                    <Button type="primary" shape="circle" icon={<ReloadOutlined/>} onClick={clearMessage} size="large"/>
                </div>
            </div>
        </div>
    );
}

export default Home;
