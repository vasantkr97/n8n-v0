import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeTelegramAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: any,
    previousNodeId?: string
): Promise<any> {
    try {
        if (!credentialId) {
            throw new Error("Telegram credentials not provided. Please select or create credentials.");
        }

        console.log("🔍 Looking up credential with ID:", credentialId);
        const credentials = await prisma.credentials.findFirst({
            where: { id: credentialId}
        });
        
        console.log("🔍 Retrieved Credentials:", credentials);
        
        if (!credentials || !credentials.data || typeof credentials.data !== 'object') {
            throw new Error("Telegram credentials not found");
        }

        const credData = credentials.data as { botToken?: string};

        if (!credData.botToken) {
            throw new Error("Bot token not found in credentials");
        }

        const botToken = credData.botToken;
        let { chatId, message, parseMode = 'HTML', usePreviousResult } = node.parameters as any;

        // Build effective message using previous output if requested
        let effectiveMessage = message || '';
        if (usePreviousResult && context.data) {
            let previousText: string | undefined;
            try {
                const sourceMap = context.data as any;
                let chosen: any;
                
                // Use the immediate previous node if available, otherwise fall back to old logic
                if (previousNodeId && sourceMap && typeof sourceMap === 'object') {
                    chosen = sourceMap[previousNodeId];
                    console.log(`🔍 Using immediate previous node result from: ${previousNodeId}`);
                } else {
                    // Fallback to old logic for backward compatibility
                    const preferredSourceId = (node.parameters as any)?.previousNodeId;
                    if (preferredSourceId && sourceMap && typeof sourceMap === 'object') {
                        chosen = sourceMap[preferredSourceId];
                    } else if (sourceMap && typeof sourceMap === 'object') {
                        const values = Object.values(sourceMap);
                        if (Array.isArray(values) && values.length > 0) {
                            // Prefer a value that has a 'text' string (e.g., Gemini), else use last value
                            const withText = [...values].reverse().find((v: any) => 
                                (v && typeof v === 'object' && typeof v.text === 'string') || 
                                typeof v === 'string' || 
                                typeof v === 'object'
                            );
                            chosen = withText ?? values[values.length - 1];
                        }
                    }
                }
                
                if (typeof chosen === 'string') {
                    previousText = chosen;
                } else if (chosen && typeof chosen === 'object') {
                    previousText = (chosen as any).text ?? JSON.stringify(chosen);
                }
            } catch {}

            if (previousText) {
                if (effectiveMessage.includes('{{previous}}')) {
                    effectiveMessage = effectiveMessage.split('{{previous}}').join(previousText);
                } else if (effectiveMessage.trim().length === 0) {
                    effectiveMessage = previousText;
                } else {
                    effectiveMessage = `${effectiveMessage}\n\n${previousText}`;
                }
            }
        }

        if (!chatId || (!effectiveMessage && !message)) {
            throw new Error("ChatId and message are required for Telegram action");
        };

        const processedMessage = replaceVariable(effectiveMessage || message, context);
        console.log(effectiveMessage || message)
        console.log("Processed message:", processedMessage);

        //Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: processedMessage,
                parse_mode: parseMode
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = await response.json();
        console.log("telegram node result", result)

        if (!response.ok) {
            throw new Error(`Telegra, API error: ${result.description}`);
        };

        return {
            success: true,
            data: result,
            message: "Telegram message sent successfully"
        }

    } catch (error: any) {
        console.error("Telegram execution error:", error.message);
        
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: "Telegram API request timed out",
                data: null
            };
        }
        return {
            success: false,
            error: error.message,
            data: null
        }
    }
}