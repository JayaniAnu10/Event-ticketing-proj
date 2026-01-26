import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface UpcomingEvents {
  name: string;
  date: string;
  availableSeats: number;
  image: string;
}

interface DashboardDetails {
  totEvents: number;
  totUsers: number;
  totBookings: number;
  revenue: number;
  upcomingEvents: UpcomingEvents[];
}
const useAdminDash = () => {
  const fetchDetails = async () => {
    const res = await axiosInstance.get("/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });
    return res.data;
  };
  return useQuery<DashboardDetails, Error>({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchDetails,
  });
};

export default useAdminDash;
