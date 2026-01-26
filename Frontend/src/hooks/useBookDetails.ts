import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface BookingPayload {
  userId: number;
  ticketCategoryId: number;
  eventId: number;
  quantity: number;
}

export interface BookingResponse {
  id: number;
}

const useBookDetails = () => {
  return useMutation<BookingResponse, AxiosError, BookingPayload>({
    mutationFn: async ({ userId, ticketCategoryId, eventId, quantity }) => {
      const res = await axiosInstance.post(
        `/booking/${userId}/${ticketCategoryId}`,
        { eventId, quantity },
      );

      return res.data;
    },
  });
};

export default useBookDetails;
