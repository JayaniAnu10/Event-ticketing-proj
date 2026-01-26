import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
interface User {
  name: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
}

const useAddUser = () => {
  const navigate = useNavigate();

  return useMutation<any, Error, User>({
    mutationFn: async (data: User) => {
      const res = await axiosInstance.post("/users", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("SignUp successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to register user");
    },
  });
};

export default useAddUser;
