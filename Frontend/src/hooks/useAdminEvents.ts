import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
    ticketCategoryId: number;
    totalQty: number;
    availableQty: number;
    unitPrice: number;
    type: string;
  }[];
}

const useAdminEvents = () => {
  const fetchDetails = async () => {
    const res = await axiosInstance.get("/admin/events", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  };

  return useQuery<EventDetails[], AxiosError>({
    queryKey: ["admin", "events"],
    queryFn: fetchDetails,
  });
};

export default useAdminEvents;
