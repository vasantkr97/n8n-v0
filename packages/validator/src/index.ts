import { z } from "zod";

export const PlatformEnum = z.enum(["ResendEmail", "Telegram", "Gemini"]);
export const TriggerTypeEnum = z.enum(["MANUAL", "WEBHOOK", "CRON"]);
export const MethodEnum = z.enum(["GET", "POST", "PUT"]);
export const ExecutionModeEnum = z.enum(["MANUAL","TRIGGER","WEBHOOK","CRON"])
export const ExecStatusEnum = z.enum(["PENDING", "RUNNING", "SUCCESS", "FAILED"])


export const NodeInputSchema = z.object({
    nodeId: z.string(),
    type: z.string().min(1, "Node type is required"),
    position: z.object({ x: z.number(), y: z.number() }),
    parameters: z.any(),
    connections: z.any()
});

export const CreateWorkflowSchema = z.object({
        title: z.string().min(1, "Workflow title is required").max(50, "Title too long"),
        isActive: z.boolean().optional().default(false),
        triggerType: TriggerTypeEnum,
        webhookId: z.string().optional(),
        nodes: z.array(NodeInputSchema).optional(),
})