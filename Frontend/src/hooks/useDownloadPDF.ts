import { axiosInstance } from "@/utils/apiClient";
import { useMutation } from "@tanstack/react-query";

const useDownloadTickets = () => {
  return useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await axiosInstance.get(
        `/booking/${bookingId}/download`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/zip",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-${bookingId}-tickets.zip`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export default useDownloadTickets;
