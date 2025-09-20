import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkflow } from "../../apiServices/workflow.api";



export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWorkflow,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] })
        }
    })
};

