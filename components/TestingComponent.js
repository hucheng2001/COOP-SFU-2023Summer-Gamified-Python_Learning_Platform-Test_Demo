import Editor from "@monaco-editor/react"
import { useRef, useState, useContext, useEffect  } from 'react'
import Context from '../context/Context'
import axios from 'axios'
import { get } from "https"
import Button from 'react-bootstrap/Button'
import { Configuration, OpenAIApi } from "openai"

// This component generates test cases for the provided editorText
export default function TestingComponent(props) {
    const options = {
        fontSize: "14px",
        minimap: {enabled: false}
    }

    const [copilotOutput, setCopilotOutput] = useState("# Start typing above to generate tests")
    useEffect(() => {
        makeRequest()
    }, []);

    function makeRequest() {
        if (props.editorText == undefined || props.editorText.length == 0) {
            return
        }
        const config = new Configuration({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        })
        const prompt = "As Python code, create tests for the following Python code:\n" + props.editorText + "\n\n\n"
        const openai = new OpenAIApi(config)
        const result = openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 4000,
        }).then((response) => {
            setCopilotOutput(response.data.choices[0].text)
        }).catch((err) => {
            setCopilotOutput("# Testing generation is unavailable at this time")
        });
    }
    
    // Context used: editor state
    const { setEditorState } = useContext(Context)

    // Ref for the editor element
    const editorRef = useRef()

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    function handleEditorChange(value, event) {
        setEditorVal(value)
    }

    return (
        <Editor
            height="40vh"
            defaultLanguage="python"
            value={copilotOutput}
            options={options}
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    )
}
