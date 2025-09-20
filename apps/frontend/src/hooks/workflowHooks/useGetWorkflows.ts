import { useQuery } from "@tanstack/react-query"
import { getWorkflows } from "../../apiServices/workflow.api"


export const useGetWorkflows = () => {
    return useQuery({
        queryKey: ['workflows'],
        queryFn: getWorkflows
    })
}