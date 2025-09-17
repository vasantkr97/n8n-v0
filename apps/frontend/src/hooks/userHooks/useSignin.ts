import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signin } from "../../api/auth";


const useSignin = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signin,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"]}),
    });

    return { error , isPending, Signin: mutate }
};

export default useSignin;