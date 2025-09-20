import { useQuery } from "@tanstack/react-query"
import { getExecutionStatus } from "../../apiServices/execution.api"

export const useExecutionStatus = (executionId: string | null) => {
  return useQuery({
    queryKey: ["execution-status", executionId],
    queryFn: () => getExecutionStatus(executionId!),
    enabled: !!executionId,
    refetchInterval: (data) => {
      // Stop polling if execution is completed or failed
      const status = data?.status
      return status === "RUNNING" || status === "PENDING" ? 2000 : false
    },
    staleTime: 0, // Always fetch fresh data for live status
  })
}

