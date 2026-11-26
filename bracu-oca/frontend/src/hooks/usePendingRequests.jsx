import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import apiClient from "../utils/apiClient";

const usePendingRequests = () => {
  const { user } = useContext(AuthContext);
  const { data: pendingRequests = [], refetch: pendingRequestsRefetch } = useQuery({
    queryKey: ["pending-events", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await apiClient.get(`/pending-events/${user.email}`);
      return res.data;
    },
  });

  return [pendingRequests, pendingRequestsRefetch];
};

export default usePendingRequests;
