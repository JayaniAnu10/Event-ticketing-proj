import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";

const useCheckout = () => {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await axiosInstance.post("/checkout", { bookingId });
      return res.data;
    },
  });
};

export default useCheckout;
