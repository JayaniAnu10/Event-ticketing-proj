import APIClient from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  contact: string;
  password: string;
}

const useAddUser = () => {
  const navigate = useNavigate();
  const apiClient = new APIClient<User>("/users", true); // ← Add true here for public endpoint

  return useMutation<any, Error, User>({
    mutationFn: async (data: User) => {
      return await apiClient.post(data);
    },
    onSuccess: () => {
      toast.success("SignUp successfully");
      navigate("/login");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
};

export default useAddUser;
