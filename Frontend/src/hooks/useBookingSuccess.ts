import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface BookingDetails {
  id: number;
  eventName: string;
  description: string;
  location: string;
  quantity: number;
  ticketCategory: string;
  date: string;
  total: number;
  image: string;
}

const useBookingSuccess = (id: number) => {
  const fetchBookingDetails = async () => {
    const res = await axiosInstance.get(`/booking/getDetails/${id}`);

    return res.data;
  };
  return useQuery<BookingDetails, Error>({
    queryKey: ["BookingDetails", id],
    queryFn: fetchBookingDetails,
  });
};

export default useBookingSuccess;
