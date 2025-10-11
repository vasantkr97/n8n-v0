import { axiosInstance } from "../lib/axios";

export const getAuthUser = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/me")
        return data
    } catch (error: any) {
        // Silently handle auth errors (401, 403) - user is just not authenticated
        if (error.response?.status === 401 || error.response?.status === 403) {
            return { user: null, authentication: false };
        }
        console.error("Error in getAuthUser:", error);
        return { user: null, authentication: false };
    }
};

export const signup = async (signupData: any) => {
    const res  = await axiosInstance.post("/auth/signup", signupData)
    return res.data
};

export const signin = async (signinData: any) => {
    const res = await axiosInstance.post("/auth/signin", signinData)
    return res.data
};

export const signout = async () => {
    const res = await axiosInstance.post('/auth/signout');
    return res.data
}