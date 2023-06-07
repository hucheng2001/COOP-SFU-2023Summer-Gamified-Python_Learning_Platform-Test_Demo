import { useState, useEffect  } from 'react'
import { Configuration, OpenAIApi } from "openai"

// This component provides live coding feedback using natural language
export default function CopilotComponent(props) {
    const [copilotOutput, setCopilotOutput] = useState("Start typing above to receive feedback")

    useEffect(() => {
        makeRequest()
    }, []);

    const makeRequest = () => {
        if (props.editorText == undefined || props.editorText == 0) {
            return
        }
        const config = new Configuration({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        })
        const openai = new OpenAIApi(config)

        const message = [
            {role: "system", content: "You are a Python developer."},
            {role: "user", content: "In plain text, provide feedback for the following Python code:\n" + props.editorText},
            {role: "assistant", content: "The Python programming langauge."}
        ]
        const result = openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: message,
        }).then((response) => {
            setCopilotOutput(response.data.choices[0].message.content)
        }).catch((err) => {
            setCopilotOutput("Copilot is unavailable at this time")
        });
    }
    
    return (
        <p>
            {copilotOutput}
        </p>
    )
}
