import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../../apiServices/auth.api"


const useAuthUser = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on component mount if data exists
    });

    return {
        isLoading,
        error,
        authUser: data?.user || null,
        isAuthenticated: !!data?.user
    }
};

export default useAuthUser;