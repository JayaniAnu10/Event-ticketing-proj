import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface EventDetails {
  id: number;
  name: string;
  location: string;
  description: string;
  availableSeats: number;
  totalSeats: number;
  eventDate: string;
  image: string;
  category: string;
  ticketCategories: {
    id: number;
    ticketCategoryId: number;
    totalQty: number;
    availableQty: number;
    unitPrice: number;
    type: string;
  }[];
}

const useEventDetails = (id: number) => {
  const fetchEventDetails = async () => {
    const res = await axiosInstance.get<EventDetails>(`/events/${id}`);
    return res.data;
  };
  return useQuery<EventDetails, Error>({
    queryKey: ["EventDetails", id],
    queryFn: fetchEventDetails,
  });
};

export default useEventDetails;
