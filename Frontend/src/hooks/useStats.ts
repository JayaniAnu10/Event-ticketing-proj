import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface Stats {
  totEvents: number;
  totUsers: number;
}

const useStats = () => {
  const fetchStats = async () => {
    const res = await axiosInstance.get("/users");
    return res.data;
  };

  return useQuery<Stats, Error>({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });
};

export default useStats;
