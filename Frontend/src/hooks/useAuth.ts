import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

const fetchUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

const useAuth = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useAuth;
