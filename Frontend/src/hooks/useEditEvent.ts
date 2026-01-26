import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";

interface EditEventPayload {
  id: number;
  data?: any;
  image?: File | null;
}

const useEditEvent = () => {
  return useMutation({
    mutationFn: async ({ id, data }: EditEventPayload) => {
      const res = await axiosInstance.patch(`/admin/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
  });
};

export default useEditEvent;
