import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";

export async function executeGeminiAction(
  node: WorkflowNode,
  context: ExecutionContext,
  credentialId: any
): Promise<any> {
  try {
    
    if (!credentialId) {
      throw new Error("Credentials id not found");
    }

    const credentials = await prisma.credentials.findFirst({
      where: { id: credentialId }
    });

    console.log("Retrieved Credentials", credentials);

    if (!credentials || !credentials.data || typeof credentials.data !== "object") {
      throw new Error("Gemini Credentials not Found");
    }

    const credData = credentials.data as { apiKey?: string };
    const apiKey = credData.apiKey;

    if (!apiKey) {
      throw new Error("Gemini API key not found in credentials");
    }

    const { prompt, model = "gemini-1.5-flash", temperature = 0.7 } = node.parameters;

    if (!prompt) {
      throw new Error('Prompt is required for Gemini Action');
    }

    const processedPrompt = replaceVariable(prompt, context);

    // FIX: Changed from v1beta to v1
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: processedPrompt }]
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
    console.log("gemini node result", result);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${result.error?.message || JSON.stringify(result)}`);
    }

    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      success: true,
      data: {
        text: generatedText,
        model: model,
        // FIX: Changed usageMetaData to usageMetadata (correct spelling)
        inputTokens: result.usageMetadata?.promptTokenCount,
        outputTokens: result.usageMetadata?.candidatesTokenCount
      },
      message: "Gemini response generated Successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}