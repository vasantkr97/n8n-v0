import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../../apiServices/auth.api"


const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false
    });

    return { isLoading: authUser.isLoading, error: authUser.error, authUser: authUser.data?.user }
};

export default useAuthUser;