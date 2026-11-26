import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";

const useAllEvents = () => {
  const { data: allEvents = [], refetch: allEventsRefetch } = useQuery({
    queryKey: ["allEvents"],
    queryFn: async () => {
      const res = await apiClient.get("/all-events");
      return res.data;
    },
  });

  return [allEvents, allEventsRefetch];
};

export default useAllEvents;
