import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  bookingCount: number;
  createdAt: string;
}

const useManageUsers = (searchQuery: string) => {
  const fetchDetails = async () => {
    const res = await axiosInstance.get("/admin/users", {
      params: { q: searchQuery },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return res.data;
  };

  return useQuery<User[], AxiosError>({
    queryKey: ["admin", "users", searchQuery],
    queryFn: fetchDetails,
  });
};

export default useManageUsers;
