import { useMutation,  useQueryClient } from "@tanstack/react-query"
import { signup } from "../../api/auth";


const useSignup = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    })
    return { isPending, error, SignupMutation: mutate };
};

export default useSignup;