import styles from "./UserInputView.module.css";
import {Button} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useRef, useEffect, useState} from "react";
import config from "../config/config";
import stringConstant from "../config/stringConstant";
import GraphType from "../config/graphType";
import {ApiHelper} from "../utils/ApiHelper";
import endPoint from "../config/endPoint";


const UserInputView = ({   showView,
                           setCurrentRunningSubgraphName,
                           setTotalSubgraph,
                           getMdEditorValue,
                           setSaveMdEditorValue,
                           setGetStatusCall,
                           setGetAutoGenStatusCall,
                           setSaveSetAutoGenTaskId,
                           getAutoGenTaskId,
                           getAutoGenResult,
                           setIsFinal,
                           setSaveOpenAIKey,
                           setSaveUserRequirement,
                           setSaveProductInfo,
                           setSaveSelectedGraphType,
                           autoGenStatus,
                           setIsAutoGenNewSession,
                           isAutoGenNewSession
                       }) => {
    const [selectedGraphType, setSelectedGraphType] = useState(GraphType.OnboardProject);
    const [openAIKey, setOpenAIKey] = useState("");
    const [recentOnboardId, setRecentOnboardId] = useState(localStorage.getItem(config.GraphId));
    const [repoRootFolder, setRepoRootFolder] = useState(null);
    const [userRequirement, setUserRequirement] = useState("");
    const [productInfo, setProductInfo] = useState("");
    const pollingInterval = 5000;
    const [uploadStatus, setUploadStatus] = useState(false)


    const disableStart = useRef(true)
    const userRequirementRef = useRef("")
    const repoRootFolderRef = useRef(null)
    const openAIKeyRef = useRef("")
    const onboardIdRef = useRef("")
    const productInfoRef = useRef("")

    useEffect(() => {
        if (uploadStatus) {
            const intervalId = setInterval(async () => {
                const uploadStatusRequestBody = JSON.stringify({
                    upload_id: localStorage.getItem(config.UploadId)
                })
                try {
                    const uploadStatusResponse = await ApiHelper.postRequest(endPoint.StatusUpload, uploadStatusRequestBody, {
                            headers: config.CustomHeaders,
                        }
                    );
                    if (uploadStatusResponse.status === 200) {
                        console.log(uploadStatusResponse.data)
                        if (uploadStatusResponse.data.status === 1 || uploadStatusResponse.data.status === 3) {
                            if (uploadStatusResponse.data.progress !== null) {
                                setSaveMdEditorValue(stringConstant.UploadStatus + stringConstant.Current +
                                    uploadStatusResponse.data.progress.current + "/" + stringConstant.Total + uploadStatusResponse.data.progress.total)
                            } else {
                                setSaveMdEditorValue(uploadStatusResponse.data.message)
                            }
                        }
                        else if (uploadStatusResponse.data.status === 2) {
                            const requestBody = JSON.stringify({
                                openai_key: openAIKey,
                                upload_id: localStorage.getItem(config.UploadId)
                            })
                            const response = await ApiHelper.postRequest(endPoint.OnboardRepo, requestBody)
                            const data = response.data;
                            if (response.status === 200) {
                                console.log(data)
                                localStorage.setItem(config.GraphId, data.graph_id)
                                localStorage.setItem(config.CurrentGraphId, data.graph_id)
                                setGetStatusCall(true)
                                setRecentOnboardId(data.graph_id)
                            } else {
                                setSaveMdEditorValue(stringConstant.APIFail)   
                            }
                            setUploadStatus(false)
                        }
                        // If response data status is other than 1, 2 or 3, then it is an internel error
                        else {
                            setSaveMdEditorValue(stringConstant.APIFail)
                            setUploadStatus(false)                       
                        }
                    } else {
                        // If response status is other than 200, then it is an internel error
                        setSaveMdEditorValue(stringConstant.APIFail)
                        setUploadStatus(false)
                    }
                } catch(error) {
                    setSaveMdEditorValue(stringConstant.APIFail)
                    setUploadStatus(false)
                } 
            }, pollingInterval);
            return () => clearInterval(intervalId);
        }
    }, [uploadStatus, pollingInterval]);


    const handleGraphTypeSelectChange = (e) => {
        setSelectedGraphType(e.target.value);
        setSaveSelectedGraphType(e.target.value);
        isReady(e.target.value)
    };
    const handleOpenAIKeyInputChange = (event) => {
        setOpenAIKey(event.target.value);
        setSaveOpenAIKey(event.target.value)
        openAIKeyRef.current = event.target.value
        isReady()
    };
    const handleRecentOnboardIDInputChange = (event) => {
        setRecentOnboardId(event.target.value)
        onboardIdRef.current = event.target.value
        isReady()
    };
    const handleFileChange = (event) => {
        const files = event.target;
        let totalSize = 0;
        for (let i = 0; i < files.files.length; i++) {
            if (totalSize > config.UploadFilesSizeLimit) {
                alert(stringConstant.FileSizeAlert);
                repoRootFolderRef.current = null
                return
            }
            totalSize = totalSize + files.files[i].size
        }
        if (totalSize < config.UploadFilesSizeLimit) {
            setRepoRootFolder(files);
            repoRootFolderRef.current = files
        } else {
            alert(stringConstant.FileSizeAlert);
            repoRootFolderRef.current = null
            return
        }
        isReady()
    };

    const handleUserRequirementInputChange = (event) => {
        setUserRequirement(event.target.value);
        setSaveUserRequirement(event.target.value)
        userRequirementRef.current = event.target.value
        isReady()
    };

    const handleProductInfoInputChange = (event) => {
        setProductInfo(event.target.value);
        setSaveProductInfo(event.target.value)
        isReady()
    };

    function isReady(graphType = null) {
        if (graphType === null) {
            graphType = selectedGraphType
        }
        if(graphType === GraphType.OnboardProject) {
            if (openAIKeyRef.current === "" || repoRootFolderRef.current === null) {
                disableStart.current = true
                return false
            } else {
                disableStart.current = false
                openAIKeyRef.current = null
                return true
            }
        }
        else if(graphType === GraphType.GeneratePRD) {
            if (openAIKeyRef.current === "" || userRequirementRef.current === "" || productInfoRef.current === "" || (onboardIdRef.current === "" && recentOnboardId === "")) {
                disableStart.current = true
                return false
            } else {
                disableStart.current = false
                return true
            }
        }
        else if(graphType === GraphType.TechSolution || graphType === GraphType.RepoChat || graphType === GraphType.AutoGenAnalysis) {
            if (openAIKeyRef.current === "" || userRequirementRef.current === "" || (onboardIdRef.current === "" && recentOnboardId === "")) {
                disableStart.current = true
                return false
            } else {
                disableStart.current = false
                return true
            }
        }
    }
    const uploadFiles = async () => {
        if (repoRootFolder) {
            const files = repoRootFolder.files;
            const fileContents = [];
            const filenames = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileContent = await readFile(file);
                fileContents.push(fileContent);
                filenames.push(file.name);
            }
            const requestBody = JSON.stringify({
                file_contents: fileContents,
                file_names: filenames
            })
            try {
                const response = await ApiHelper.postRequest(endPoint.UploadRepo, requestBody);
                const data = response.data;
                if (response.status === 200) {
                    setUploadStatus(true)
                    setSaveMdEditorValue(stringConstant.UploadHint)
                    localStorage.setItem(config.UploadId, data.upload_id)
                    console.log(data.upload_id);
                    console.log(localStorage.getItem(config.UploadId));
                } else {
                    setUploadStatus(false)
                    setSaveMdEditorValue(stringConstant.APIFail)
                }
                return true
            } catch (error) {
                setUploadStatus(false)
                setSaveMdEditorValue(error.message)
                console.error('Error:', error);
                window.alert(error);
                return false
            }
        }
    };

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const fileContent = event.target.result;
                resolve(fileContent);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }

    const startClicked = async () => {
        if (selectedGraphType === GraphType.OnboardProject) {
            if(await onboardRepo()) {
                setTotalSubgraph([
                    "Onboarding your project",
                ])
                setCurrentRunningSubgraphName("Onboarding your project")
            }
        } else if (selectedGraphType === GraphType.GeneratePRD) {
            if(await writePRD()){
                setTotalSubgraph([
                    "Step1: Analyzing your requirement",
                    "Step2: Generating PRD",
                ])
                setCurrentRunningSubgraphName("Step1: Analyzing your requirement")
            }
        } else if (selectedGraphType === GraphType.TechSolution) {
            if(await techSolution()) {
                setTotalSubgraph([
                    "Step1: Generating Technical Solution",
                ])
                setCurrentRunningSubgraphName("Step1: Generating Technical Solution")
            }
        } else if (selectedGraphType === GraphType.RepoChat) {
            if(await RepoChat()) {
                setTotalSubgraph([
                    "Chat with your repository",
                ])
                setCurrentRunningSubgraphName("Chat with your repository")
            }
        }else if(selectedGraphType === GraphType.AutoGenAnalysis){
            if (await AutoGenAnalysis(userRequirement)){
                setTotalSubgraph([
                    "AutoGen Analysis(Beta)",
                ])
                setCurrentRunningSubgraphName("AutoGen Analysis(Beta)")
            }
        }
    }

    const writePRD = async () => {
        disableStart.current = true
        const requestBody = JSON.stringify({
            openai_key: openAIKey,
            current_graph_id: localStorage.getItem(config.GraphId),
            onboarding_id: localStorage.getItem(config.GraphId),
            requirement: userRequirement,
            edit_content: getMdEditorValue,
            project_additional_info: productInfo
        })
        try {
            const response = await ApiHelper.postRequest(endPoint.Prd, requestBody, {
                headers: config.CustomHeaders,
            });
            setSaveMdEditorValue(stringConstant.WaitHint)
            if (response.status === 200) {
                localStorage.setItem(config.CurrentGraphId, response.data.graph_id)
                setGetStatusCall(true)
                return true
            } else {
                setSaveMdEditorValue(stringConstant.APIFail)
            }

        } catch (error) {
            setSaveMdEditorValue(error.message)
            console.error('Error:', error);
            window.alert(error);
            return false
        }
    }

    const techSolution = async () => {
        disableStart.current = true
        const requestBody = JSON.stringify({
            openai_key: openAIKey,
            onboarding_id: localStorage.getItem(config.GraphId),
            requirement: userRequirement,
        })
        setSaveMdEditorValue(stringConstant.WaitHint)
        try {
            const response = await ApiHelper.postRequest(endPoint.TechSolution, requestBody, {
                headers: config.CustomHeaders,
            });
            if (response.status === 200) {
                localStorage.setItem(config.CurrentGraphId, response.data.graph_id)
                setGetStatusCall(true)
                return true
            } else {
                setSaveMdEditorValue(stringConstant.APIFail)
            }
        } catch (error) {
            setSaveMdEditorValue(error.message)
            console.error('Error:', error);
            window.alert(error);
            return false
        }
    }

    const RepoChat = async () => {
        disableStart.current = true
        const requestBody = JSON.stringify({
            openai_key: openAIKey,
            onboarding_id: localStorage.getItem(config.GraphId),
            requirement: userRequirement,
        })
        setSaveMdEditorValue(stringConstant.WaitHint)
        try {
            const response = await ApiHelper.postRequest(endPoint.RepoChat, requestBody, {
                headers: config.CustomHeaders,
            });
            if (response.status === 200) {
                localStorage.setItem(config.CurrentGraphId, response.data.graph_id)
                setGetStatusCall(true)
                return true
            } else {
                setSaveMdEditorValue(stringConstant.APIFail)
            }
        } catch (error) {
            setSaveMdEditorValue(error.message)
            console.error('Error:', error);
            window.alert(error);
            return false
        }
    }

    const AutoGenAnalysis = async ( requirement ) => {
        if(requirement.toLowerCase().replace(/\s/g, '') === "confirm"){
            requirement = ""
        }
        disableStart.current = true
        const requestBody = JSON.stringify({
            openai_key: openAIKey,
            onboarding_id: localStorage.getItem(config.GraphId),
            requirement: requirement,
            task_id: getAutoGenTaskId,
            is_new_session: isAutoGenNewSession
        })
        setSaveMdEditorValue(stringConstant.WaitHint)
        try {
            const response = await ApiHelper.postRequest(endPoint.AutoGenAnalysis, requestBody, {
                headers: config.CustomHeaders,
            });
            if (response.status === 200) {
                console.log(response.data)
                if (response.data.status === 1) {
                    setSaveSetAutoGenTaskId(response.data.task_id)
                    setIsAutoGenNewSession(false)
                    setGetAutoGenStatusCall(true)
                    getAutoGenResult.current = ""
                } else if (response.data.status === 2) {
                    setIsAutoGenNewSession(true)
                } else if (response.data.status === 3) {
                    setSaveSetAutoGenTaskId(response.data.task_id)
                    setIsAutoGenNewSession(false)
                    setGetAutoGenStatusCall(true)
                }
                return true
            } else {
                setSaveMdEditorValue(stringConstant.APIFail)
            }
        } catch (error) {
            setSaveMdEditorValue(error.message)
            setIsAutoGenNewSession(true)
            console.error('Error:', error);
            window.alert(error);
            return false
        }
    }

    const onboardRepo = async () => {
        if (openAIKey === null || openAIKey === '') {
            window.alert(stringConstant.OpenAIKeyAlert);
            return
        }
        disableStart.current = true
        setSaveMdEditorValue(stringConstant.WaitHint)
        return await uploadFiles()
    }

    const startButtonText = () => {
        return (selectedGraphType === GraphType.RepoChat || selectedGraphType === GraphType.AutoGenAnalysis) ? "Send" : "Start"
    }

    return (<div className={styles.userinputview}
                 style={showView ? {} : {width: "0%"}}>
        <div className={styles.producttitlecomponent}>
            <b className={styles.solidgpt}>🧱 SolidGPT</b>
        </div>
        <select style={{fontSize: '13px', fontWeight: 'bold'}} className={styles.graphtype}
                         onChange={handleGraphTypeSelectChange} value={selectedGraphType}>
                {/* <option style={{fontSize: '13px'}} value="" disabled hidden>
                    Select An Action To Start
                </option> */}
                <option value={GraphType.OnboardProject} style={{fontSize: '13px'}}>{GraphType.OnboardProject}
                </option>
                <option value={GraphType.AutoGenAnalysis} style={{fontSize: '13px'}}>{GraphType.AutoGenAnalysis}
                </option>
                <option value={GraphType.RepoChat} style={{fontSize: '13px'}}>{GraphType.RepoChat}
                </option>
                <option value={GraphType.GeneratePRD} style={{fontSize: '13px'}}>{GraphType.GeneratePRD}
                </option>
                <option value={GraphType.TechSolution} style={{fontSize: '13px'}}>{GraphType.TechSolution}
                </option>
        </select>
        {selectedGraphType === GraphType.OnboardProject && <div className={styles.repofolderpath}>
                <div style={{fontSize: '12px', fontWeight: 'bold'}}>{'Repository (<50mb:)'}</div>
                <input type="file" directory="" webkitdirectory=""
                       onChange={handleFileChange}/>
                {/* <Button onClick={uploadFiles}>Upload</Button>*/}
        </div>}
        <div className={styles.openaikey}>
                <div style={{fontSize: '12px', fontWeight: 'bold'}}>Open AI API key:</div>
                <TextArea bordered={false}
                          value={openAIKey}
                          onChange={handleOpenAIKeyInputChange}
                          autoSize={{minRows: 1, maxRows: 1}} placeholder="OpenAI API Key:"/>
        </div>
        {(selectedGraphType === GraphType.GeneratePRD ||
                selectedGraphType === GraphType.TechSolution)
            && <div>
                <div>
                    <TextArea className={styles.requirement} bordered={false}
                              value={userRequirement}
                              onChange={handleUserRequirementInputChange}
                              autoSize={{minRows: 8, maxRows: 8}}
                              allowClear placeholder="Please input your requirement"
                    />
                </div>
            </div>}
        {(selectedGraphType === GraphType.RepoChat || selectedGraphType === GraphType.AutoGenAnalysis)
        && <div>
            <div>
                <TextArea className={styles.requirement} bordered={false}
                        value={userRequirement}
                        onChange={handleUserRequirementInputChange}
                        autoSize={{minRows: 8, maxRows: 8}}
                        allowClear placeholder="Send a message"
                />
            </div>
        </div>}
        {selectedGraphType === GraphType.GeneratePRD && <div>
            <div>
                <TextArea className={styles.productInfo} bordered={false}
                          value={productInfo}
                          onChange={handleProductInfoInputChange}
                          autoSize={{minRows: 8, maxRows: 8}}
                          allowClear placeholder="Please input your product information"/>
            </div>
        </div>}
        <div>
            <Button className={styles.startbutton}
                    onClick={startClicked}
                    disabled={selectedGraphType === "" || disableStart.current}
            >
                {startButtonText()}
            </Button>
        </div>
        {localStorage.getItem(config.GraphId) !== '' &&
            <div className={styles.mostrecentrepoid}>
                <div style={{fontSize: '13px', fontWeight: 'bold'}}>
                    Onboard ID:
                </div>
                <TextArea
                    style={{textAlign: 'left'}}
                    bordered={false}
                    value={recentOnboardId}
                    onChange={handleRecentOnboardIDInputChange}
                    autoSize={{minRows: 1, maxRows: 2}} placeholder="Onboard project ouput, required by tech-solution/prd actions"/></div>
        }
    </div>);
};

export default UserInputView;
