import { axiosInstance } from "../lib/axios"; 

export const createWorkflow = async () => {
    const { data } = await axiosInstance.get("/workflows/createWorkflow")
    return data
}

export const getallWorkflows = async () => {
    const { data } = await axiosInstance.get("/workflows/getallWorkflows")
    return data
}

export const getWorkflowById = async (workflowId: string ) => {
    const { data } = await axiosInstance.get(`/workflows/getWorkflowId/${workflowId}`)
    return data
}

export const manualExecute = async (workflowId: string) => {
    const { data } = await axiosInstance.post(`workflows/manual/run/${workflowId}`)
    return data;
}

export const updateWorkflow = async (workflowId: string) => {
    const { data } = await axiosInstance.put(`workflows/updateWrkflow/${workflowId}`)
    return data
}

export const deleteWorkflow = async (WorkflowId: string) => {
    const { data } = await axiosInstance.delete(`/workflows/deleteWorkflow/${WorkflowId}`)
    return data
};



