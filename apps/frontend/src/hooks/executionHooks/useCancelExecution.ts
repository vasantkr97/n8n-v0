import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cancelExecution } from "../../apiServices/execution.api"
// import { toast } from "react-hot-toast" // Temporarily commented out

export const useCancelExecution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (executionId: string) => cancelExecution(executionId),
    onSuccess: () => {
      // toast.success("Execution cancelled successfully") // Temporarily commented out
      console.log("Execution cancelled successfully")
      queryClient.invalidateQueries({ queryKey: ["execution-status"] })
      queryClient.invalidateQueries({ queryKey: ["execution-history"] })
    },
    onError: (error: any) => {
      // toast.error(error?.response?.data?.error || "Failed to cancel execution") // Temporarily commented out
      console.error("Cancel execution error:", error?.response?.data?.error || "Failed to cancel execution")
    },
  })
}

