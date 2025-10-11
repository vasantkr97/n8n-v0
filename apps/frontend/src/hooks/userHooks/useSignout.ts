import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signout } from "../../apiServices/auth.api";


const useSignout = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signout,
        onSuccess: () => {
            // Clear all queries on signout
            queryClient.clear();
            // Optionally invalidate specific queries
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    return { 
        error, 
        isPending, 
        signout: mutate, 
        isLoading: isPending 
    }
};

export default useSignout;

