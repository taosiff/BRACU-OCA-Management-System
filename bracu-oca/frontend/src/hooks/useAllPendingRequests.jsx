import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

const useAllPendingRequests = () => {
  const {
    data: allPendingRequests = [],
    refetch: allPendingRequestsRefetch,
    isLoading,
  } = useQuery({
    queryKey: ["allPendingRequests"],
    queryFn: async () => {
      const res = await apiClient.get("/all-pending-events");
      return res.data;
    },
  });

  return [allPendingRequests, allPendingRequestsRefetch, isLoading];
};

export default useAllPendingRequests;
