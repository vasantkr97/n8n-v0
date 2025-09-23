import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";


export async function executeTelegramAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentials: any
): Promise<any> {
    try {
        if (!credentials || !credentials.data.botToken) {
            throw new Error("Telegram credentials not found");
        };

        const { botToken } = credentials.data;
        const { chatId, message, parseMode = 'HTML' } = node.parameters;

        if (!chatId || !message) {
            throw new Error("ChatId and message are required for Telegram action");
        };

        const processedMessage = replaceVariables(message, context);

        const response = await fetch(`https:api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: processedMessage,
                parse_mode: parseMode
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(`Telegra, API error: ${result.description}`);
        };

        return {
            success: true,
            data: result,
            message: "Telegram message sent successfully"
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            data: null
        }
    }
}