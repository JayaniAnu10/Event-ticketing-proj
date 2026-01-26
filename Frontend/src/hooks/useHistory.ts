import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface BookingDetails {
  id: number;
  name: string;
  bookingDate: string;
  location: string;
  eventDate: string;
  totalTickets: number;
  totalPayment: number;
  eventTicket: string;
  image: string;
}

const useHistory = () => {
  const fetchBookingDetails = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await axiosInstance.get("/users/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  return useQuery<BookingDetails[], Error>({
    queryKey: ["users", "history"],
    queryFn: fetchBookingDetails,
  });
};

export default useHistory;
