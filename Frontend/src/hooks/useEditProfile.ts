import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";

interface UpdateUserRequest {
  name?: string;
  email?: string;
  contact?: string;
}

const useEditProfile = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateUserRequest;
    }) => {
      const res = await axiosInstance.put(`/users/${id}`, data);
      return res.data;
    },
  });
};

export default useEditProfile;
