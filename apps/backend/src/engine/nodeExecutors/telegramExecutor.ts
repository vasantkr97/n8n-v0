import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeTelegramAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: any
): Promise<any> {
    try {

        if (!credentialId) {
            throw new Error("credential id not found")
        }
        console.log("🔍 Looking up credential with ID:", credentialId);
        const credentials = await prisma.credentials.findFirst({
            where: { id: credentialId}
        });
        
        console.log("🔍 Retrieved Credentials:", credentials);
        console.log("🔍 All credentials in database:");
        const allCreds = await prisma.credentials.findMany({
            select: { id: true, title: true, platform: true }
        });
        console.log(allCreds);
        if (!credentials || !credentials.data || typeof credentials.data !== 'object') {
            throw new Error("Telegram credentials not found");
        };

        const credData = credentials.data as { botToken?: string};

        if (!credData.botToken) {
            throw new Error("Bot token not found in credentials");
        }

        const  botToken  = credData.botToken;
        const { chatId, message, parseMode = 'HTML' } = node.parameters;

        if (!chatId || !message) {
            throw new Error("ChatId and message are required for Telegram action");
        };

        const processedMessage = replaceVariable(message, context);
        console.log(message)
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