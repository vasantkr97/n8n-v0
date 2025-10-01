import { axiosInstance } from "../lib/axios"

// Workflow Execution APIs
export const manualExecute = async (workflowId: string,) => {
    const { data } = await axiosInstance.post(`/executions/workflows/${workflowId}/execute`)
    return data
};

export const getAllExecutions = async () => {
    const data = await axiosInstance.get("/executions/list")
    return data
}
// Get execution history for a specific workflow
export const getWorkFlowExecution = async (workflowId: string) => {
    const { data } = await axiosInstance.get(`/executions/workflow/${workflowId}/history`)
    return data
}

export const getExecutionById = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}/details`)
    return data
}

export const getExecutionStatus = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}/status`)
    return data
};

export const stopExecution = async (executionId: string) => {
    const { data } = await axiosInstance.post(`/executions/${executionId}/cancel`)
    return data
}

export const deleteExecution = async (executionId: string) => {
    const { data } = await axiosInstance.delete(`/executions/${executionId}`,)
    return data
}

