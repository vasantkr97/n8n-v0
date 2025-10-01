import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";
import { GoogleGenAI } from "@google/genai";


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

    const client = new GoogleGenAI({
      apiKey: apiKey
    })

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: processedPrompt,
      config: {
        temperature: Number(temperature) || 0.7,
        topK: 40,
        topP: 0.95
      }
    })

    const generatedText = response?.text;
    console.log(generatedText)

    return {
      success: true,
      data: {
        text: generatedText,
        model: model,
        // FIX: Changed usageMetaData to usageMetadata (correct spelling)
        inputTokens: response.usageMetadata?.promptTokenCount,
        outputTokens: response.usageMetadata?.candidatesTokenCount
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