import { useEffect } from "react";
import { useAuthStore } from "../store/user";
import { navigate } from "vike/client/router";

export const useAuthRedirect = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
        navigate("/");
    }
  }, [user, navigate]);
};
