import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

const useAllClubs = () => {
  const { data: allClubs = [], refetch: allClubsRefetch, isLoading } = useQuery({
    queryKey: ["allClubs"],
    queryFn: async () => {
      const res = await apiClient.get("/all-clubs");
      return res.data;
    },
  });

  return [allClubs, allClubsRefetch, isLoading];
};

export default useAllClubs;
