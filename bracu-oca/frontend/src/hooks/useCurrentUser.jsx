import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import apiClient from "../utils/apiClient";

const useCurrentUser = () => {
  const { user } = useContext(AuthContext);
  const mail = user?.email;

  const { data: currentUser = {}, refetch: currentUserRefetch } = useQuery({
    queryKey: ["currentUser", mail],
    enabled: !!mail,
    queryFn: async () => {
      const res = await apiClient.get(`/current-user/${mail}`);
      return res.data;
    },
  });

  return [currentUser, currentUserRefetch];
};

export default useCurrentUser;
