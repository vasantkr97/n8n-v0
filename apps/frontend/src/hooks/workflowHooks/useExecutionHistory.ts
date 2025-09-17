import { useQuery } from "@tanstack/react-query"
import { getExecutionHistory } from "../../api/execution"

export const useExecutionHistory = (workflowId: string) => {
  return useQuery({
    queryKey: ["execution-history", workflowId],
    queryFn: () => getExecutionHistory(workflowId),
    enabled: !!workflowId,
    refetchInterval: 5000, // Refresh every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  })
}

