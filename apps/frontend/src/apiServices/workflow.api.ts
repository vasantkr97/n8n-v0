import { axiosInstance } from "../lib/axios"; 

export const getWorkflows = async () => {
    const { data } = await axiosInstance.get("/workflows/getallWorkflows")
    return data
}

export const getWorkflowById = async (id: string) => {
    const { data } = await axiosInstance.get(`/workflows/getWorkflowById/${id}`)
    return data
}

export const createWorkflow = async (workflowData: any) => {
    const { data } = await axiosInstance.post("/workflows/createWorkflow", workflowData)
    return data
};

export const deleteWorkflow = async (id: string) => {
    const { data } = await axiosInstance.delete(`/workflows/deleteWorkflow/${id}`)
    return data
};

export const updateWorkflow = async ({ workflowId, updatedWorkflow }: { workflowId: string, updatedWorkflow: any }) => {
    const { data } = await axiosInstance.put(`/workflows/updateWorkflow/${workflowId}`, updatedWorkflow)
    return data
}


