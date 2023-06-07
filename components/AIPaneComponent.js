import { useContext, useState, useEffect } from 'react'
import CopilotComponent from "./CopilotComponent"
import TestingComponent from "./TestingComponent"
import { TabContext } from '../context/TabContext'

export default function AIPaneComponent(props) {
    // in AI components useEffect won't be triggered without a unique key
    const [rand, setRand] = useState("")
    const [editorText, setEditorText] = useState("")
    const { activeTab, setActiveTab } = useContext(TabContext)

    // Ensure editorText is updated once, only when changed
    useEffect(() => {
        setEditorText(props.editorText)
        let randString = (Math.random() + 1).toString(36).substring(7)
        setRand(randString)
    }, [props.editorText]);

    // Tab for coding feedback
    const handleCopilotTab = () => {
        setActiveTab("copilot");
    };
    // Tab for test case generation
    const handleTestingTab = () => {
        setActiveTab("testing");
    };

    return (
        <div className="editor-output">
            <div className="output">
                <ul className="nav">
                    <li
                        className={activeTab === "copilot" ? "active" : ""}
                        onClick={handleCopilotTab}
                    >
                        Copilot
                    </li>
                    <li
                        className={activeTab === "testing" ? "active" : ""}
                        onClick={handleTestingTab}
                    >
                        Test Cases
                    </li>
                </ul>

                <div className="outlet">
                    {activeTab === "copilot" ? <CopilotComponent key={rand} editorText={editorText}/> : <TestingComponent key={rand} editorText={editorText} />}
                </div>
            </div>
        </div>
    );
}
