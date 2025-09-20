import { useQuery } from "@tanstack/react-query"
import { getWorkflowById } from "../../apiServices/workflow.api"


export const useGetWorkflow = (WorkflowId: any) => {
    return useQuery({
        queryKey: ['workflow', WorkflowId],
        queryFn: () => getWorkflowById(WorkflowId)
    })
}