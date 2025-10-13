import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";
import { GoogleGenAI } from "@google/genai";


export async function executeGeminiAction(
  node: WorkflowNode,
  context: ExecutionContext,
  credentialId: any,
  previousNodeId?: string
): Promise<any> {
  try {
    // Try to use credentials by id; if not present, we may fallback to node.parameters.apiKey

    let apiKeyFromCreds: string | undefined;
    if (credentialId) {
      console.log("🔍 Looking up credential with ID:", credentialId);
      const credentials = await prisma.credentials.findFirst({
        where: { id: credentialId }
      });

      console.log("🔍 Retrieved Credentials:", credentials);

      if (credentials && credentials.data && typeof credentials.data === "object") {
        const credData = credentials.data as { apiKey?: string };
        apiKeyFromCreds = credData.apiKey;
      }
    }

    let { prompt, model = "gemini-1.5-flash", temperature = 0.7, usePreviousResult, apiKey: apiKeyFromParams } = node.parameters as any;
    const apiKey = apiKeyFromCreds || apiKeyFromParams;
    if (!apiKey) {
      throw new Error("Gemini API key not provided. Select credentials or enter an API key in the node config.");
    }
    if (usePreviousResult && context.data && !prompt) {
      try {
        let chosen: any;
        
        // Use the immediate previous node if available, otherwise fall back to old logic
        if (previousNodeId && context.data && typeof context.data === 'object') {
          chosen = (context.data as any)[previousNodeId];
          console.log(`🔍 Using immediate previous node result from: ${previousNodeId}`);
        } else {
          // Fallback to old logic for backward compatibility
          chosen = context.data;
        }
        
        if (typeof chosen === 'string') {
          prompt = chosen;
        } else if (chosen && typeof chosen === 'object') {
          prompt = (chosen as any).text ?? JSON.stringify(chosen);
        } else {
          prompt = typeof context.data === 'string' ? context.data : JSON.stringify(context.data);
        }
      } catch {}
    }

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