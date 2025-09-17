import { useMutation, useQueryClient } from "@tanstack/react-query"
import { executeWorkflow } from "../../api/execution"
// import { toast } from "react-hot-toast" // Temporarily commented out

interface ExecuteWorkflowParams {
  workflowId: string
  inputData?: any
}

export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workflowId, inputData }: ExecuteWorkflowParams) =>
      executeWorkflow(workflowId, inputData),
    onSuccess: (data) => {
      // toast.success("Workflow execution started!") // Temporarily commented out
      console.log("Workflow execution started!")
      queryClient.invalidateQueries({ queryKey: ["execution-history"] })
      return data
    },
    onError: (error: any) => {
      // toast.error(error?.response?.data?.error || "Failed to execute workflow") // Temporarily commented out
      console.error("Workflow execution error:", error?.response?.data?.error || "Failed to execute workflow")
    },
  })
}

