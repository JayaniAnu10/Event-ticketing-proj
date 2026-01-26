import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: number;
  name: string;
  location: string;
  description: string;
  availableSeats: number;
  eventDate: string;
  image: string;
  category: string;
}

const useEvents = () => {
  const fetchEvents = async () => {
    const res = await axiosInstance.get("/events");
    return res.data;
  };

  return useQuery<Event[], Error>({
    queryKey: ["Events"],
    queryFn: fetchEvents,
  });
};

export default useEvents;
