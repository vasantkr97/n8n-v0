import { prisma } from "@n8n/db";
import { ExecutionContext, WorkflowNode } from "../../types/executionTypes";
import replaceVariable from "../replaceVariable";


export async function executeEmailAction(
    node: WorkflowNode,
    context: ExecutionContext,
    credentialId: any
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
        
        const { from, to, subject, html, text } = node.parameters;

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