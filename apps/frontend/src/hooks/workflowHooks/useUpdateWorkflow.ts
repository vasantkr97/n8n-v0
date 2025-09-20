import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateWorkflow } from "../../apiServices/workflow.api"


export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:  updateWorkflow,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows']})
        }
    })
}