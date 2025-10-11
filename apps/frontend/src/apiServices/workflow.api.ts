import { axiosInstance } from "../lib/axios"; 

export interface CreateWorkflowData {
    title: string;
    isActive?: boolean;
    triggerType: string;
    nodes?: any;
    connections?: any;
}

export interface UpdateWorkflowData {
    title?: string;
    isActive?: boolean;
    triggerType?: string;
    nodes?: any;
    connections?: any;
}

export const createWorkflow = async (workflowData: CreateWorkflowData) => {
    const { data } = await axiosInstance.post("/workflows/createWorkflow", workflowData);
    return data;
}

export const getallWorkflows = async () => {
    const { data } = await axiosInstance.get("/workflows/getallWorkflows");
    return data;
}

export const getWorkflowById = async (workflowId: string) => {
    const { data } = await axiosInstance.get(`/workflows/getWorkflowById/${workflowId}`);
    return data;
}

export const updateWorkflow = async (workflowId: string, workflowData: UpdateWorkflowData) => {
    const { data } = await axiosInstance.put(`/workflows/updateWorkflow/${workflowId}`, workflowData);
    return data;
}

export const deleteWorkflow = async (workflowId: string) => {
    const { data } = await axiosInstance.delete(`/workflows/deleteWorkflow/${workflowId}`);
    return data;
};

