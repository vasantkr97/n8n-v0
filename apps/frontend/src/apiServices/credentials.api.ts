import { axiosInstance } from "../lib/axios"

export interface CredentialData {
    title: string;
    platform: string;
    data: any;
}

export interface UpdateCredentialData {
    title?: string;
    platform?: string;
    data?: any;
}

export const postCredentials = async (credentialData: CredentialData) => {
    const { data } = await axiosInstance.post("/credentials/postCredentials", credentialData);
    return data;
};

export const getCredentials = async () => {
    const { data } = await axiosInstance.get("/credentials/getCredentials");
    return data;
};

export const getCredentialById = async (id: string) => {
    const { data } = await axiosInstance.get(`/credentials/getCredentiaslById/${id}`);
    return data;
};

export const updateCredentials = async (id: string, credentialData: UpdateCredentialData) => {
    const { data } = await axiosInstance.put(`/credentials/updateCred/${id}`, credentialData);
    return data;
};

export const deleteCredentials = async (id: string) => {
    const { data } = await axiosInstance.delete(`/credentials/deleteCred/${id}`);
    return data;
}