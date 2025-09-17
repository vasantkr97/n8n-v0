import { axiosInstance } from "../lib/axios"

// Workflow Execution APIs
export const executeWorkflow = async (workflowId: string, inputData?: any) => {
    const { data } = await axiosInstance.post(`/workflows/manual/run/${workflowId}`, {
        inputData: inputData || {}
    })
    return data
}

export const getExecutionStatus = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}`)
    return data
}

export const getExecutionHistory = async (workflowId: string) => {
    const { data } = await axiosInstance.get(`/executions/workflow/${workflowId}`)
    return data
}

export const getExecutionDetails = async (executionId: string) => {
    const { data } = await axiosInstance.get(`/executions/${executionId}`)
    return data
}

export const cancelExecution = async (executionId: string) => {
    const { data } = await axiosInstance.post(`/executions/cancel/${executionId}`)
    return data
}

export const deleteExecution = async (executionId: string) => {
    const { data } = await axiosInstance.delete(`/executions/${executionId}`)
    return data
}

export const getExecutionStats = async (workflowId?: string) => {
    const url = workflowId ? `/executions/stats?workflowId=${workflowId}` : '/executions/stats'
    const { data } = await axiosInstance.get(url)
    return data
}

export const getAllExecutions = async (params?: {
    page?: number
    limit?: number
    status?: string
    workflowId?: string
}) => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.workflowId) searchParams.append('workflowId', params.workflowId)
    
    const { data } = await axiosInstance.get(`/executions?${searchParams.toString()}`)
    return data
}