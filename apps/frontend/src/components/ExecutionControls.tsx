import React, { useState } from "react"
import { useExecuteWorkflow } from "../hooks/executionHooks/useExecuteWorkflow"
import { useExecutionStatus } from "../hooks/executionHooks/useExecutionStatus"
import { useCancelExecution } from "../hooks/executionHooks/useCancelExecution"

interface ExecutionControlsProps {
  workflowId: string
  isWorkflowActive: boolean
  onExecutionStart?: (executionId: string) => void
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  workflowId,
  isWorkflowActive,
  onExecutionStart
}) => {
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null)
  const [inputData, setInputData] = useState<string>("{}")

  const executeWorkflow = useExecuteWorkflow()
  const { data: executionStatus } = useExecutionStatus(currentExecutionId)
  const cancelExecution = useCancelExecution()

  const handleExecute = async () => {
    try {
      let parsedInputData = {}
      if (inputData.trim()) {
        parsedInputData = JSON.parse(inputData)
      }

      const result = await executeWorkflow.mutateAsync({
        workflowId,
        inputData: parsedInputData
      })

      if (result?.data?.executionId) {
        setCurrentExecutionId(result.data.executionId)
        onExecutionStart?.(result.data.executionId)
      }
    } catch (error) {
      console.error("Failed to execute workflow:", error)
    }
  }

  const handleCancel = () => {
    if (currentExecutionId) {
      cancelExecution.mutate(currentExecutionId)
      setCurrentExecutionId(null)
    }
  }

  const isRunning = executionStatus?.status === "RUNNING" || executionStatus?.status === "PENDING"

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Execution Controls</h3>
      
      {/* Input Data */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Data (JSON)
        </label>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          className="w-full h-20 p-2 border border-gray-300 rounded-md font-mono text-sm"
          placeholder='{"key": "value"}'
        />
      </div>

      {/* Execution Status */}
      {currentExecutionId && executionStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Execution:</span>
            <span className="text-xs text-gray-500">{currentExecutionId}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              executionStatus.status === "RUNNING" ? "bg-blue-500 animate-pulse" :
              executionStatus.status === "PENDING" ? "bg-yellow-500" :
              executionStatus.status === "SUCCESS" ? "bg-green-500" :
              executionStatus.status === "ERROR" ? "bg-red-500" :
              "bg-gray-500"
            }`}></div>
            <span className="text-sm capitalize">{executionStatus.status}</span>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleExecute}
          disabled={!isWorkflowActive || executeWorkflow.isPending || isRunning}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            !isWorkflowActive || executeWorkflow.isPending || isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {executeWorkflow.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Starting...</span>
            </div>
          ) : isRunning ? (
            "Running..."
          ) : (
            "▶️ Execute Workflow"
          )}
        </button>

        {isRunning && (
          <button
            onClick={handleCancel}
            disabled={cancelExecution.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {cancelExecution.isPending ? "Cancelling..." : "⏹️ Cancel"}
          </button>
        )}
      </div>

      {/* Workflow Status Warning */}
      {!isWorkflowActive && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ Workflow is inactive. Activate it to enable execution.
          </p>
        </div>
      )}
    </div>
  )
}

