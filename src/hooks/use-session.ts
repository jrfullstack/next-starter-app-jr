"use client";

import { useSession } from "next-auth/react";

export const useUserSession = () => {
  const { data: session, status } = useSession();
  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
};
