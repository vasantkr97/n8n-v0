import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeEmailAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: any,
    previousNodeId?: string
): Promise<any> {
    try {
        console.log("email is called");
        
        if (!credentialId) {
            throw new Error("Email credentials not provided. Please select or create credentials.");
        }

        console.log("🔍 Looking up credential with ID:", credentialId);
        const credentials = await prisma.credentials.findFirst({
            where: { id: credentialId }
        });

        if (!credentials || !credentials.data || typeof credentials.data !== 'object') {
            throw new Error("Email Credentials not Found");
        }

        const credData = credentials.data as {apiKey?: string; fromEmail?: string};

        if (!credData.apiKey) {
            throw new Error("Resend API key not found in credentials");
        }

        const apiKey = credData.apiKey;
        const fromEmail = credData.fromEmail;
        
        let { from, to, subject, html, text, usePreviousResult } = node.parameters as any;
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
                    const sourcePayload = preferredSourceId ? sourceMap?.[preferredSourceId] : undefined;
                    chosen = sourcePayload ?? sourceMap;
                }
                
                if (typeof chosen === 'string') {
                    previousText = chosen as string;
                } else if (chosen && typeof chosen === 'object') {
                    previousText = (chosen as any).text ?? JSON.stringify(chosen);
                }
            } catch {}

            if (previousText) {
                if (typeof html === 'string' && html.length > 0) {
                    if (html.includes('{{previous}}')) {
                        html = html.split('{{previous}}').join(previousText);
                    } else {
                        html = `${html}<br/><br/>${previousText}`;
                    }
                } else if (typeof text === 'string' && text.length > 0) {
                    if (text.includes('{{previous}}')) {
                        text = text.split('{{previous}}').join(previousText);
                    } else {
                        text = `${text}\n\n${previousText}`;
                    }
                } else {
                    text = previousText;
                }
            }
        }

        if (!from || !to || !subject) {
            throw new Error('From, to, and subject are required for email action');
        }

        if (!html && !text) {
            throw new Error('Either HTML or text content is required for email');
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
                "Authorization": `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })

        const result = await response.json()
        console.log("email node result",result)

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