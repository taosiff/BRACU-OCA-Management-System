import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import apiClient from "../utils/apiClient";

const useRespondedRequests = () => {
  const { user } = useContext(AuthContext);
  const { data: respondedRequests = [], refetch: respondedRequestsRefetch } = useQuery({
    queryKey: ["responded-events", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await apiClient.get(`/responded-events/${user.email}`);
      return res.data;
    },
  });

  return [respondedRequests, respondedRequestsRefetch];
};

export default useRespondedRequests;
