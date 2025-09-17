import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../../api/auth"


const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false
    });

    return { isLoading: authUser.isLoading, error: authUser.error, authUser: authUser.data?.user }
};

export default useAuthUser;