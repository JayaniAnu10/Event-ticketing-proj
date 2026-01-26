import { axiosInstance } from "@/utils/apiClient";
import { useQuery } from "@tanstack/react-query";

interface UserDetails {
  id: number;
  name: string;
  email: string;
  contact: string;
}

const useUserDetails = (id: number) => {
  const fetchEventDetails = async () => {
    const res = await axiosInstance.get<UserDetails>(`/users/${id}`);
    return res.data;
  };
  return useQuery<UserDetails, Error>({
    queryKey: ["user", id],
    queryFn: fetchEventDetails,
  });
};

export default useUserDetails;
