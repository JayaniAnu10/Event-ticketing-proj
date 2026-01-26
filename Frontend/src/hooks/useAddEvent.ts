import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface TicketCategory {
  name: string;
  totalSeats: number;
  unitPrice: number;
}

interface Event {
  name: string;
  location: string;
  description: string;
  totalSeats: number;
  eventDate: string;
  image?: File;
  category: string;
  ticketCategory: TicketCategory[];
}

const useAddEvent = () => {
  return useMutation<any, Error, Event>({
    mutationFn: async (data: Event) => {
      const formData = new FormData();

      const requestPayload = {
        name: data.name,
        location: data.location,
        description: data.description,
        totalSeats: data.totalSeats,
        eventDate: data.eventDate,
        category: data.category,
        ticketCategory: data.ticketCategory,
      };

      formData.append(
        "event",
        new Blob([JSON.stringify(requestPayload)], {
          //Binary Large OBject. create a file-like object in memory.converts your JavaScript object into a JSON string, which can be sent like a file
          type: "application/json",
        }),
      );

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axiosInstance.post("/admin/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return res.data;
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });
};

export default useAddEvent;
