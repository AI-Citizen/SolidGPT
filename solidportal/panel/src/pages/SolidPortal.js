import UserInputView from "../components/UserInputView";
import styles from "./SolidPortal.module.css";
import {useEffect, useRef, useState} from "react";
import {Button, FloatButton} from "antd";
import {CloseCircleOutlined, RightCircleOutlined} from "@ant-design/icons";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import config from "../config/config";
import stringConstant from "../config/stringConstant";
import Cookies from 'js-cookie';
import GraphType from "../config/graphType";
import {ApiHelper} from "../utils/ApiHelper";
import endPoint from "../config/endPoint";
import AutoGenActivePlannerState from "../config/autoGenActivePlannerState";


const SolidPortal = () => {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [floatIcon, setFloatIcon] = useState(< CloseCircleOutlined/>);
    const [nodeSelected, setNodeSelected] = useState("");
    const [currentRunningSubgraphName, setCurrentRunningSubgraphName] = useState("")
    const [totalSubgraph, setTotalSubgraph] = useState([])
    const [status, setStatus] = useState(false)
    const [autoGenStatus, setAutoGenStatus] = useState(false)
    const [autoGenTaskId, setAutoGenTaskId] = useState(null)
    const [isAutoGenNewSession, setIsAutoGenNewSession] = useState(true)
    let state_id = useRef("");
    let autoGenResult = useRef("");
    const [showTermsCondition, setShowTermsCondition] = useState(false)
    const [mdEditorValue, setMdEditorValue] = useState(showTermsCondition ? stringConstant.TermsCondition : stringConstant.MdEditorStartText);
    const saveMdEditorValue = (mdEditorValue) => {
        setMdEditorValue(mdEditorValue)
    }
    const [isFinal, setIsFinal] = useState(true)
    const pollingInterval = 5000;
    const [openAIKey, setOpenAIKey] = useState("");
    const saveOpenAIKey = (openAIKey) => {
        setOpenAIKey(openAIKey)
    }
    const [userRequirement, setUserRequirement] = useState("");
    const saveUserRequirement = (userRequirement) => {
        setUserRequirement(userRequirement)
    }
    const [productInfo, setProductInfo] = useState("");
    const saveProductInfo = (productInfo) => {
        setProductInfo(productInfo)
    }
    const [selectedGraphType, setSelectedGraphType] = useState(GraphType.OnboardProject);
    const saveSelectedGraphType = (selectedGraphType) => {
        setSelectedGraphType(selectedGraphType)
    }

    const saveCurrentRunningSubgraphName = (currentRunningSubgraphName) => {
        setCurrentRunningSubgraphName(currentRunningSubgraphName)
        setNodeSelected(currentRunningSubgraphName)
    }
    const saveSetTotalSubgraph = (totalSubgraph) => {
        setTotalSubgraph(totalSubgraph)
    }

    const saveGetStatusCall = (boolean) => {
        setStatus(boolean)
    }

    const saveGetAutoGenStatusCall = (boolean) => {
        setAutoGenStatus(boolean)
    }

    const saveSetAutoGenTaskId = (taskId) => {
        setAutoGenTaskId(taskId)
    }

    const saveIsFinal = (boolean) => {
        setIsFinal(boolean)
    }

    const saveIsAutoGenNewSession = (boolean) => {
        setIsAutoGenNewSession(boolean)
    }

    const userInputView = (
        <UserInputView
            showView={!showTermsCondition && showLeftPanel}
            setCurrentRunningSubgraphName={saveCurrentRunningSubgraphName}
            setTotalSubgraph={saveSetTotalSubgraph}
            getMdEditorValue={mdEditorValue}
            setSaveMdEditorValue={saveMdEditorValue}
            setGetStatusCall={saveGetStatusCall}
            setGetAutoGenStatusCall={saveGetAutoGenStatusCall}
            setSaveSetAutoGenTaskId={saveSetAutoGenTaskId}
            getAutoGenTaskId={autoGenTaskId}
            getAutoGenResult={autoGenResult}
            setIsFinal={saveIsFinal}
            setSaveOpenAIKey={saveOpenAIKey}
            setSaveUserRequirement={saveUserRequirement}
            setSaveProductInfo={saveProductInfo}
            setSaveSelectedGraphType={saveSelectedGraphType}
            autoGenStatus={autoGenStatus}
            setIsAutoGenNewSession={saveIsAutoGenNewSession}
            isAutoGenNewSession={isAutoGenNewSession}
        />
    );


    // const [autoGenActivePlannerState, setAutoGenActivePlannerState] = useState(AutoGenActivePlannerState.Disable);
    // const activeAutoGenPlanner = async () => {
    //     console.log(autoGenActivePlannerState)
    //     if (autoGenActivePlannerState === AutoGenActivePlannerState.Disable) {
    //         await AutoGenAnalysis('ask planner')
    //         setAutoGenActivePlannerState(AutoGenActivePlannerState.RequestPlanner)
    //     }
    //     else if (autoGenActivePlannerState === AutoGenActivePlannerState.RequestPlanner) {
    //         await AutoGenAnalysis('')
    //         setAutoGenActivePlannerState(AutoGenActivePlannerState.Confirm)
    //     }
    //     else if (autoGenActivePlannerState === AutoGenActivePlannerState.Confirm) {
    //         setAutoGenActivePlannerState(AutoGenActivePlannerState.Active)
    //     }
    //     else {
    //         return;
    //     }
    // };

    useEffect(() => {
        const requestBody = JSON.stringify({
            graph_id: localStorage.getItem(config.CurrentGraphId)
        })
        if (status) {
            const intervalId = setInterval(async () => {
                try {
                    const response = await ApiHelper.postRequest(endPoint.StatusGraph, requestBody, {
                        headers: config.CustomHeaders,
                    });

                    if (response.status === 200) {
                        console.log(response.data)
                        if (response.data.status === 1) {
                            if (response.data.graph === stringConstant.OnboardRepoGraph) {
                                if (response.data.progress !== null) {
                                    setMdEditorValue(stringConstant.OnboardRepoGraph + stringConstant.Status + stringConstant.Current + response.data.progress.current + "/" + stringConstant.Total + response.data.progress.total)
                                } else {
                                    setMdEditorValue(response.data.message)
                                }
                            } else if (response.data.graph === stringConstant.PRDGraph) {
                                if (response.data.progress !== null) {
                                    setMdEditorValue(stringConstant.OnboardRepoGraph + stringConstant.Status + stringConstant.Current + response.data.progress.current + "/" + stringConstant.Total + response.data.progress.total)
                                } else {
                                    setMdEditorValue(response.data.message)
                                }
                            } else if (response.data.graph === stringConstant.TechSolutionGraph) {
                                if (response.data.progress !== null) {
                                    setMdEditorValue(stringConstant.OnboardRepoGraph + stringConstant.Status + stringConstant.Current + response.data.progress.current + "/" + stringConstant.Total + response.data.progress.total)
                                } else {
                                    setMdEditorValue(response.data.message)
                                }
                            }

                        }
                        else if (response.data.status === 2) {
                            if (selectedGraphType === GraphType.OnboardProject) {
                                setMdEditorValue(stringConstant.OnboardFinishHint + response.data.result)
                            } 
                            else {
                                setMdEditorValue(response.data.result)
                            }
                            //TODO: change this to true
                            currentRunningSubgraphName === "Step1: Analyzing your requirement"  ? setIsFinal(false) : setIsFinal(true)
                            setStatus(false)
                        }
                        // If response data status is other than 1 or 2, then it is an internel error
                        else {
                            setMdEditorValue(stringConstant.APIFail)
                            setStatus(false)                       
                        }
                    } else {
                        setMdEditorValue(stringConstant.APIFail)
                        setStatus(false)
                    }
                } catch (e) {
                    console.log(e)
                    setMdEditorValue("Failed to get status update")
                    setStatus(false)
                }

            }, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [status, pollingInterval]);

    useEffect( () =>{
        const requestBody = JSON.stringify({
            task_id: autoGenTaskId
        })
        if (autoGenStatus){
            const intervalId = setInterval(async () => {
                try {
                    const response = await ApiHelper.postRequest(endPoint.StatusAutoGen, requestBody, {
                        headers: config.CustomHeaders,
                    });

                    if (response.status === 200) {
                        console.log(response.data)
                        if (response.data.status === 1 || response.data.status === 2){
                            setMdEditorValue(response.data.message)
                            setAutoGenStatus(false)
                            if (response.data.status === 2) {
                                setIsAutoGenNewSession(true)
                            }
                        }else if(response.data.status === 3){
                            console.log(response.data.result)
                            if (state_id.current !== response.data.result.state_id){
                                console.log(state_id.current)
                                autoGenResult.current = response.data.result.result + autoGenResult.current
                                setMdEditorValue(autoGenResult.current)
                                setAutoGenStatus(false)
                                // check current planner status
                                // await activeAutoGenPlanner()
                            }
                            state_id.current = response.data.result.state_id;
                        }

                    }else{
                        setMdEditorValue(stringConstant.APIFail)
                        setAutoGenStatus(false)
                    }

                } catch (e) {
                    console.log(e)
                    setMdEditorValue("Failed to get status update")
                    setAutoGenStatus(false)
                }
            }, pollingInterval);
            return () => clearInterval(intervalId);
        }


    },[autoGenStatus, pollingInterval] )


    const toggleIcon = () => {
        if (!showLeftPanel) {
            setFloatIcon(< CloseCircleOutlined/>);
        } else {
            setFloatIcon(<RightCircleOutlined/>);
        }
    };
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
            <Button /*onClick={() => handleListNodeClick(text)}*/
                className={styles.node}
                type={setListNodeButtonType(text)}>{text}</Button>
        );
    }

    const continueClicked = async () => {
        if (showTermsCondition){
            setShowTermsCondition(false)
            setMdEditorValue(stringConstant.MdEditorStartText)
            Cookies.set(stringConstant.AcceptTermsCondition, "true", { expires: 3 });
            return
        }
        setMdEditorValue("Continue running...")
        if (selectedGraphType === GraphType.GeneratePRD) {
            await writePRD()
            setIsFinal(true)
            saveCurrentRunningSubgraphName("Step2: Generating PRD")
        }
    }

    const writePRD = async () => {
        const requestBody = JSON.stringify({
            openai_key: openAIKey,
            current_graph_id: localStorage.getItem(config.CurrentGraphId),
            onboarding_id: localStorage.getItem(config.GraphId),
            requirement: userRequirement,
            edit_content: mdEditorValue,
            project_additional_info: productInfo
        })
        const response = await ApiHelper.postRequest(endPoint.Prd, requestBody, {
            headers: config.CustomHeaders,
        });
        if (response.status === 200) {
            localStorage.setItem(config.CurrentGraphId, response.data.graph_id)
            setStatus(true)
        } else {
            setMdEditorValue(stringConstant.APIFail)
        }

    }

    // const AutoGenAnalysis = async ( requirement ) => {
    //     const requestBody = JSON.stringify({
    //         openai_key: openAIKey,
    //         onboarding_id: localStorage.getItem(config.GraphId),
    //         requirement: requirement,
    //         task_id: autoGenTaskId,
    //         is_new_session: false
    //     })
    //     setMdEditorValue(stringConstant.WaitHint)
    //     try {
    //         const response = await ApiHelper.postRequest(endPoint.AutoGenAnalysis, requestBody, {
    //             headers: config.CustomHeaders,
    //         });
    //         if (response.status === 200) {
    //             console.log(response.data)
    //             if (response.data.status === 1) {
    //                 setAutoGenTaskId(response.data.task_id)
    //                 saveGetAutoGenStatusCall(true)
    //             }
    //             else if (response.data.status === 3) {
    //                 setAutoGenTaskId(response.data.task_id)
    //                 saveGetAutoGenStatusCall(true)
    //             }
    //             return true
    //         } else {
    //             setMdEditorValue(stringConstant.APIFail)
    //         }
    //     } catch (error) {
    //         setMdEditorValue(error.message)
    //         console.error('Error:', error);
    //         window.alert(error);
    //         return false
    //     }
    // }

    const disableEditorWhenTermsCondition = (value) => {
        if (showTermsCondition){
            setMdEditorValue(stringConstant.TermsCondition)
        }else{
            setMdEditorValue(value)
        }
    }

    return (
        <div className={styles.solidportal}>
            {userInputView}
            {!showTermsCondition && <FloatButton type="default" icon={floatIcon} style={{left: 20}}
                         onClick={() => {
                             toggleIcon()
                             setShowLeftPanel(!showLeftPanel)
                         }}/>}
            <div className={styles.mainview}>
                <div/>
                <div className={styles.actionbuttons} style={{ display: isFinal && !showTermsCondition ? 'none' : 'flex' }}>
                    <Button className={styles.continueactiobutton} disabled={isFinal && !showTermsCondition} onClick={() => {
                        continueClicked()
                    }}>{showTermsCondition ?"Accept": "Continue"}</Button>
                </div>
                <div className={styles.statusnodelist}>
                    {totalSubgraph.map((item, index) => (
                        <ListNode key={index} text={item}/>
                    ))}
                </div>
                <div className={styles.markdowneditor}>
                    <div className="container" style={{width: '100%'}}>
                        <MDEditor
                            style={{minHeight: '70vh', width: '100%'}}
                            value={mdEditorValue}
                            onChange={disableEditorWhenTermsCondition}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                            preview={selectedGraphType === GraphType.GeneratePRD ? 'live' : 'preview'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolidPortal;
