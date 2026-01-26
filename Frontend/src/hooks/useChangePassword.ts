import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const useChangePassword = (id: number) => {
  return useMutation<unknown, AxiosError, ChangePasswordRequest>({
    mutationFn: async (data: ChangePasswordRequest) => {
      const res = await axiosInstance.post(
        `/users/${id}/change-password`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });
};

export default useChangePassword;
