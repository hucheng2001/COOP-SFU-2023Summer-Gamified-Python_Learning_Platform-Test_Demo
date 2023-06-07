import Editor from "@monaco-editor/react"
import { useRef, useState, useContext, useEffect } from 'react'
import Context from '../context/Context'
import axios from 'axios'
import CheckOutputComponent from "./CheckOutputComponent"
// import Modal from "./Modal"
import { Modal } from "react-bootstrap"
import { updateScore, solvedQuestionUpdate, checkHintUsedAndUpdate, updateQuestionData, getScore, checkAllCompleted } from "../data/ChallengeQuestions"
import { get } from "https"
import Button from 'react-bootstrap/Button'
import { getStudentScore, updateStudentLevel, getStudentLevel, takeStudentScore } from '../data/Students'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Pages } from '../context/Pages'
import eventBus from './eventbus';


import AIPaneComponent from "./AIPaneComponent"
import { TabContext } from "../context/TabContext"
let timeoutId


/**
 * The editor component for coding challenges.
 * @param {*} props 
 * @returns HTML for the editor
 */
export default function EditorComponent (props) {
    const options = {
        fontSize: "14px",
        minimap: { enabled: false }
    }

    const { challengeNumber, setChallengeNumber, challengeQuestion, challengeAnswer, user, score, setScore, openedModule, setOpenedModule, setToast, setPage } = useContext(Context)

    const moduleName = openedModule.replaceAll('-', '_')
    const currentQuestion = challengeQuestion.find(x => x.id === moduleName)?.questions.find(x => x.id === challengeNumber)
    const currentQuestionNumber = challengeQuestion.find(x => x.id === moduleName)?.questions.indexOf(challengeQuestion.find(x => x.id === moduleName)?.questions.find(x => x.id === challengeNumber)) + 1
    let nextQuestionNumber = -1
    if (challengeQuestion.find(x => x.id === moduleName)?.questions[currentQuestionNumber]) {
        nextQuestionNumber = challengeQuestion.find(x => x.id === moduleName)?.questions[currentQuestionNumber].id
    }

    // State for the code's output
    const [output, setOutput] = useState(["# Your output will be displayed here\n"])

    // State for if the code can be ran right now
    const [runEnabled, setRunEnabled] = useState(true)

    // For RunCode Error Message
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorTip, setShowErrorTip] = useState(true);
    const [countDown, setCountDown] = useState(10)
    const [isTimeout, setIsTimeout] = useState(false)
    const [modalHintShow, setModalHintShow] = useState(false);
    const [modalErrShow, setModalErrShow] = useState(false);
    const [modalModuleCompletedShow, setModalModuleCompletedShow] = useState(false);

    const [copilotRequestText, setCopilotRequestText] = useState("")
    const [rand, setRand] = useState("")
    const [activeTab, setActiveTab] = useState("copilot")
    // const [modalNextQuestionShow, setModalNextQuestionShow] = useState(false);

    // Context used: editor state
    const { setEditorState } = useContext(Context)



    useEffect(() => {
        const fn = () => {
            setCountDown(v => v + 180);
        };
        eventBus.addListener('moreTime', fn);
        return () => {
            eventBus.removeListener('moreTime', fn);
        };
    }, []);

    // Ref for the editor element
    const editorRef = useRef()


    function handleEditorDidMount (editor, monaco) {
        editorRef.current = editor
    }

    const startCountDownRef = useRef(null)
    const setCountDown_time = 10
    function startCountDown () {
        setIsTimeout(false);
        setCountDown(setCountDown_time);
        clearInterval(startCountDownRef.current)
        startCountDownRef.current = setInterval(() => {
            setCountDown((v) => {
                if (v === 0) {
                    setIsTimeout(true);
                    clearInterval(startCountDownRef.current);
                    return 0;
                }
                return v - 1;
            });
        }, 1000);
    }

    /**
     * Closes the editor.
     */
    const closeCodingChallenge = () => {
        setEditorState(0)
    }

    useEffect(() => {
        console.log("Editor Mounted!")
    }, [])

    useEffect(() => {
        const theScore = getScore(user)
        theScore.then(value => {
            setScore(value)
        })
    }, [modalHintShow])

    /**
     * Runs the code and updates the output.
     */
    const runCode = (e) => {
        if (e) e.preventDefault();
        setRunEnabled(false)

        // For now, clearing output
        setOutput([])

        const editorText = editorRef.current.getValue()

        var b = Buffer.from(editorText)
        var s = b.toString('base64')

        // Code is sent to the Rapid API server to be run
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: '{"language_id":71,"source_code":"' + s + '","stdin":"SnVkZ2Uw"}'
        }

        // Send the code to the server
        axios.request(options).then(function (response) {
            const token = response.data.token

            const getOptions = {
                method: 'GET',
                url: 'https://judge0-ce.p.rapidapi.com/submissions/' + token,
                params: { base64_encoded: 'true', fields: '*' },
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            }

            axios.request(getOptions).then(async function (response2) {
                // Receive output and update state
                const err = response2.data.stderr
                if (err) {
                    const buffErr = Buffer.from(err, 'base64')
                    const message = buffErr.toString('ascii')
                    setErrorMessage(message)
                    setModalErrShow(true)
                    setShowErrorTip(true);

                } else {
                    setErrorMessage("")
                    setModalErrShow(false)
                    setShowErrorTip(true);
                }
                setTimeout(() => {
                    setShowErrorTip(false);
                }, 3000);
                const out = response2.data.stdout
                if (out) {
                    const b = Buffer.from(out, 'base64')
                    const s = b.toString('ascii')
                    setOutput([...output, s])
                    await afterRun(s)
                    challengeAnswer[moduleName].question_data[challengeNumber].output = s
                } else {
                    const s = ""
                    setOutput([...output, s])
                    await afterRun(s)
                    challengeAnswer[moduleName].question_data[challengeNumber].output = s
                }
                challengeAnswer[moduleName].question_data[challengeNumber].mycode = editorVal
                await updateQuestionData(user, moduleName, challengeAnswer[moduleName].question_data)
                if (await checkAllCompleted(user, moduleName)) {
                    setModalModuleCompletedShow(true)
                }
                setRunEnabled(true)
            }).catch(function (error) {
                alert("Error: " + error)
                setRunEnabled(true)
            })

        }).catch(function (error) {
            alert("Error: " + error)
            setRunEnabled(true)
        })

    }

    const afterRun = async (s) => {
        challengeAnswer[moduleName].question_data[challengeNumber].active = true
        if (s.toLowerCase().replace(/(\r\n|\n|\r)/gm, "") === currentQuestion.answer.toLowerCase().replace(/(\r\n|\n|\r)/gm, "")) {
            if (challengeAnswer[moduleName].question_data[challengeNumber].completed == false) {
                if (await solvedQuestionUpdate(user, moduleName, challengeNumber)) {
                    // Increase score
                    // Synchronize steps, updating score -> updating level -> getting the new user level -> displaying toast
                    let scoreUpdatedPromise = updateScore(user, 50)
                    let scoreUpdate = await Promise.all(scoreUpdatedPromise)

                    let studentLevelChangedPromise = updateStudentLevel(user)
                    let studentLevelChanged = await Promise.all(studentLevelChangedPromise)

                    let userLevelPromise = getStudentLevel(user)
                    let userLevel = await Promise.all(userLevelPromise)

                    if (studentLevelChanged == true) {
                        setToast({
                            title: "Correct!",
                            message: <div>
                                <p>⭐ +50 score<br />You reached level {userLevel}!</p>
                                {nextQuestionNumber != -1 ? <Button variant="success" size="sm" onClick={() => { setChallengeNumber(nextQuestionNumber) }}>Try Next Question</Button> : <></>}
                            </div>
                        });
                    } else {
                        setToast({
                            title: "Correct!",
                            message: <div>
                                <p>⭐ +50 score</p>
                                {nextQuestionNumber != -1 ? <Button variant="success" size="sm" onClick={() => { setChallengeNumber(nextQuestionNumber) }}>Try Next Question</Button> : <></>}
                            </div>
                        });
                    }

                    challengeAnswer[moduleName].question_data[challengeNumber].completed = true
                } else {
                    setToast({
                        title: "Good for trying again!",
                        message: "Let's Go!😀"
                    })
                }
            } else {
                setToast({
                    title: "Good for trying again!",
                    message: "Let's Go!😀"
                })
            }
        } else {
            setToast({
                title: "Incorrect!",
                message: "Sorry that did not match our expected output. Please try again! 😀"
            })
        }
    }

    async function triggerCodingCopilot() {
        const editorText = editorRef.current.getValue()
        let randStr = (Math.random() + 1).toString(36).substring(7)
        setRand(randStr)
        setCopilotRequestText(editorText)
    }

    useEffect(() => {
        setOutput([challengeAnswer[moduleName]?.question_data[challengeNumber].output])
        setEditorVal(challengeAnswer[moduleName]?.question_data[challengeNumber].mycode);
        // time

        startCountDown();
    }, [challengeNumber])

    /**
    * Modal Stuff
    **/
    function handleOpen () {
        checkHintUsedAndUpdate(user, moduleName, challengeNumber)
        setModalHintShow(true)
    }

    function HintModal (props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter"> Hint - Question {props.title} </Modal.Title>
                </Modal.Header>
                <Modal.Body> <p dangerouslySetInnerHTML={{ __html: props.body }}></p> </Modal.Body>
            </Modal>
        );
    }

    function ErrModal (props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter"> Error Check - Question {props.title} </Modal.Title>
                </Modal.Header>
                <Modal.Body> <p>{props.body}</p> </Modal.Body>
            </Modal>
        );
    }

    /**
     * Handles a module being opened.
     * @param {*} e 
     */
    const handleModulesClick = (e) => {
        e.preventDefault()
        setOpenedModule(null)
        setPage(Pages.MODULES)
    }

    function ModuleCompletedModal (props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h2 className="mt-3">🎉 Congratulations! 🎉</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>You have completed all challenge questions in the <b>{props.title}</b> module!</h5>
                    <p>⭐ +67 score</p>
                    <p>You can redo these questions at any time for review.</p>
                    <Button variant="success" onClick={handleModulesClick}>Try Another Module!</Button>
                </Modal.Body>
            </Modal>
        );
    }

    // function NextQuestionModal(props) {        
    //     return (
    //         <Modal
    //             {...props}
    //             size="lg"
    //             aria-labelledby="contained-modal-title-vcenter"
    //             centered
    //         >
    //         <Modal.Header closeButton>
    //             <Modal.Title id="contained-modal-title-vcenter"> Error Check - Question {props.title} </Modal.Title> 
    //         </Modal.Header>
    //         <Modal.Body> <p>{props.body}</p> </Modal.Body>
    //         </Modal>
    //     );
    // }

    const deduceErrorMessage = () => {
        if (errorMessage == "") { return null }

        let text = errorMessage.split("\n");
        let headerText = "Unknown Error";
        let bodyText = "Im sorry, we were not able to figure out the error but you can always search it up on stack overflow! Below you will find the line giving more information about the error."
        // if (text.indexOf("SyntaxError:")) {
        //     headerText = SyntaxError
        // } else if (text.indexOf("SyntaxError:"))
        for (let i = 0; i < text.length; i++) {
            let textSplit = text[i].split(" ");
            if (textSplit.includes("SyntaxError:")) {
                headerText = "Syntax Error!"
                bodyText = "A Syntax Error is a way of Python telling you you've got the grammar error. You might've missed something important for Python to understand the code you have written."
            } else if (textSplit.includes("NameError:")) {
                headerText = "Naming Error!"
                bodyText = "A Naming Error occurs when you call a function or a variable that is not defined/initialized earlier... Please refer back to your code and see if you have misspelt any function/variable names or have not declared them before you called them."
            }
        }
        return (
            <div>
                <p>{headerText}</p>
                <p>{bodyText}</p>
                <p>{errorMessage}</p>
            </div>
        )
    }
    const [editorVal, setEditorVal] = useState(challengeAnswer[moduleName]?.question_data?.[challengeNumber].mycode)
    function handleEditorChange (value, event) {
        setEditorVal(value)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(triggerCodingCopilot, 3000)
    }

    const handleUnlock = () => {
        // 1、扣钱
        takeStudentScore(user, 10)
        // 2、解锁
        startCountDown();
        updateStudentLevel(user)

    }

    return (
        <div className="codingchall1 " style={{ flexGrow: 1 }}>
            <h1 style={{ color: '#fff', marginBottom: 28 }}>Coding Challenge</h1>
            <div className="layout-card global-card-base">
                <div className="layout-card-header">
                    <div className="layout-card-title">
                        Question {currentQuestionNumber} - {currentQuestion?.title}
                    </div>
                    <div className="layout-card-right">
                        <span className={countDown < 30 ? 'error-a' : ''} style={{ fontSize: 20, fontWeight: 'bold' }}>{countDown}s</span>
                    </div>
                </div>
                <div className="layout-card-main" style={{ position: 'relative' }}>
                    <div style={{ backgroundColor: '#000', borderRadius: '8px', color: '#fff', padding: '12px', marginBottom: '12px' }}>
                        <ul dangerouslySetInnerHTML={{ __html: currentQuestion?.question }}></ul>
                    </div>
                    <Editor
                        height="30vh"
                        defaultLanguage="python"
                        value={challengeAnswer[moduleName]?.question_data[challengeNumber].active ? challengeAnswer[moduleName].question_data[challengeNumber].mycode : currentQuestion?.startercode.replace(/\\n/g, "\n")}
                        // defaultValue = {challengeAnswer[moduleName].question_data[challengeNumber].mycode}
                        options={options}
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                    />

                    {isTimeout ? <div className="edit-timeout" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#000000ee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 28, textAlign: 'center' }} >
                        <div className="edit-timeout-text" style={{}}>
                            <h1>Time's Up!</h1>
                            <p>Don't worry, you can still submit your code.</p>
                        </div>
                        <div className="edit-timeout-btn">
                            <p>Unlock with coins</p>
                            <span onClick={handleUnlock} style={{
                                backgroundColor: '#f00',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                cursor: 'pointer'
                            }}>Unlock</span>
                        </div>
                    </div> : null}
                </div>

            </div>
            <div className="layout-card global-card-base" style={{ marginTop: 20, }}>
                <div className="layout-card-main" style={{ position: 'relative', paddingTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button type="button" style={{ flex: 3 }} className={"btn btn-primary" + (runEnabled ? "" : " disabled")} onClick={e => runCode(e)}>Run Code</button>
                    <button type="button" style={{ flex: 1, minWidth: 100 }} className="btn btn-light" href="#" role="button" onClick={handleOpen}>Hint</button>

                </div>
            </div>


            <p></p>

            <TabContext.Provider value={{activeTab, setActiveTab}}>
                <AIPaneComponent key={rand} editorText={copilotRequestText} />
            </TabContext.Provider>

            <p></p>

            <div className="editor-output">

                {/* layout */}
                <div className="layout-card global-card-base" style={{ marginTop: 20 }}>
                    <div className="layout-card-header">
                        <div className="layout-card-title">
                            Output
                        </div>
                    </div>
                    <div className="layout-card-main">
                        <ul>
                            {
                                output.at(-1)
                            }
                        </ul>
                        <CheckOutputComponent output={output} moduleName={moduleName} />
                        <div className="pointdescription"> You have {score} <FontAwesomeIcon icon="fa-solid fa-coins" /></div>
                        <div className="pointdescription"> 50 <FontAwesomeIcon icon="fa-solid fa-coins" /> are need to use a hint.</div>
                    </div>
                </div>

                <div className="btn-group btn-group-editor-run" role="group">
                    <HintModal
                        show={modalHintShow}
                        title={currentQuestionNumber}
                        body={currentQuestion?.hint}
                        onHide={() => setModalHintShow(false)}
                    />
                    <ErrModal
                        show={modalErrShow}
                        title={challengeNumber + 1}
                        body={deduceErrorMessage()}
                        onHide={() => setModalErrShow(false)}
                    />
                    <ModuleCompletedModal
                        show={modalModuleCompletedShow}
                        title={moduleName}
                        onHide={() => setModalModuleCompletedShow(false)}
                    />
                    {/* <NextQuestionModal
                        show={modalNextQuestionShow}
                        title={challengeNumber + 1}
                        body={<button onClick={() => {setChallengeNumber(challengeNumber + 1)}}>Try Next Question</button>}
                        onHide={() => setModalNextQuestionShow(false)}
                    /> */}
                    {/* {errorMessage != "" ? <button type="button" className="btn btn-light" href="#" role="button" onClick={() => { setModalErrShow(true) }}>Error Check</button> : ""} */}
                    
                    
                </div>
            </div>
        </div >
    )
}