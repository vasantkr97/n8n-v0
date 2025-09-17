import { axiosInstance } from "../lib/axios";

export const getAuthUser = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/me")
        return data
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
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
    const res = await axiosInstance.post('auth/signout');
    return res.data
}