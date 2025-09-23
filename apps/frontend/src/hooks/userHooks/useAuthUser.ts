import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../../apiServices/auth.api"


const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
    });

    // Return a default user if auth fails for development
    const defaultUser = { id: 'dev-user', email: 'dev@example.com', name: 'Dev User' };

    return {
        isLoading: authUser.isLoading,
        error: authUser.error,
        authUser: authUser.data?.user || defaultUser
    }
};

export default useAuthUser;