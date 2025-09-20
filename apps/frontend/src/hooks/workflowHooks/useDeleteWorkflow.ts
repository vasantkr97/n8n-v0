import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorkflow } from "../../apiServices/workflow.api"


export const useDeteleWorkflow = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (workflowId: string) => deleteWorkflow(workflowId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] })
        }
    })
}