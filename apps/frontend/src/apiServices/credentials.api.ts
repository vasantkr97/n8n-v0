import { axiosInstance } from "../lib/axios"

export const postCredentials = async () => {
    const { data } = await axiosInstance.post("/credentials/postCredentials")
    return data
};

export const getCredentials = async () => {
    const { data } = await axiosInstance.get("credentials/getCredentials")
    return data
};

export const getCredentialById = async (id: string) => {
    const { data } = await axiosInstance.get(`/credentials/getCredentialById/${id}`);
    return data
};

export const updateCredentials = async (id: string) => {
    const { data } = await axiosInstance.put(`/credentials/updateCredentials/${id}`)
    return data
};

export const deleteCredentials = async (id: string) => {
    const { data } = await axiosInstance.delete(`/credentials/deleteCred/${id}`);
    return data
}