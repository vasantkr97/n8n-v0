import { axiosInstance } from "../lib/axios"; 

export const getWorkflows = async () => {
    const { data } = await axiosInstance.get("/Workflows")
    return data
}

export const getWorkflowById = async (id: string) => {
    const { data } = await axiosInstance.get("/Workflows/${id")
    return data
}

export const createWorkflow = async () => {
    const { data } = await axiosInstance.post("/Workflows/create")

}