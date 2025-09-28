import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeGeminiAction (
    node: WorkflowNode,
    context: ExecutionContext,
    credentials: any
): Promise<any> {
    try {
        if (!credentials || !credentials.data.apikey) {
            throw new Error("Gemini Credentiasl not Found")
        }

        const { apiKey } = credentials.data
        const { prompt , model = "gemini-pro", temperature = 0.7 } = node.parameters;

        if(!prompt) {
            throw new Error('Prompt is required for Gemini Action')
        };

        const processedPrompt = replaceVariable(prompt, context);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, 
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: processedPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: temperature,
                        topK: 40,
                        topP: 0.95
                    }
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Gemini API error: ${result.error?.message}`)
        }
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        return {
            success: true,
            data: {
                text: generatedText,
                model: model,
                inputTokens: result.usageMetaData?.promptTokenCount,
                outputTokens: result.usageMetaData?.candidatesTokenCount
            },
            message: "Gemini response generated Successfully",
        }
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}