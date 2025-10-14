import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin } from "../../apiServices/auth.api";

const useSignin = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signin,
        onSuccess: () => {
            // Invalidate and refetch the auth user query to get updated authentication state
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error: any) => {
            console.error("Signin error:", error);
        }
    });

    return {
        error: error?.response?.data?.message || error?.message || "Signin failed",
        isPending,
        signin: mutate,
        isLoading: isPending
    };
};

export default useSignin;