import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeEmailAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentials: any
): Promise<any> {
    try {
        if (!credentials) {
            throw new Error("Email credentials not found")
        }

        const { apikey } = credentials.data;
        const { from, to, subject, html, text } = node.parameters;

        if (!from || !to || !subject || !html || !text) {
            throw new Error('From, to, and subject are required for email action');
        }

        const processedSubject = replaceVariable(subject, context);
        const processedHtml = html ? replaceVariable(html, context) : undefined;
        const processedText = text ? replaceVariable(text, context) : undefined;

        const emailData: any = {
            from,
            to: Array.isArray(to) ? to : [to],
            subject: processedSubject
        };

        if (processedHtml) emailData.html = processedHtml;
        if (processedText) emailData.text = processedText

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apikey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })

        const result = await response.json()

        if(!response.ok) {
            throw new Error(`Email error response: ${result.message}`)
        };

        return {
            success: true,
            data: result,
            message: "email send successfully"
        }

    } catch(error: any) {
        return {
            success: false,
            data: null,
            error: error.message
        }
    }
}