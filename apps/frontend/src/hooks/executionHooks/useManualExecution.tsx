import { useMutation, useQueryClient } from "@tanstack/react-query"
import { manualExecute } from "../../apiServices/execution.api"


export const useManualExecution = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (workflowId: string) => manualExecute(workflowId),
        onSuccess: (data) => {
            console.log("workflow execution started!");
            queryClient.invalidateQueries({ queryKey: ["execution-history"]})
            return data
        },
        onError: (error: any) => {
            console.error("Workflow execution error:", error?.response?.data?.error || "failed")
        }
    })
}