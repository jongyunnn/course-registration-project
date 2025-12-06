"use client";

import { useSession, signOut, getSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants";

export function useAuth() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const user = session?.user ?? null;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const isInstructor = useCallback(() => {
    return user?.userType === "INSTRUCTOR";
  }, [user]);

  const isStudent = useCallback(() => {
    return user?.userType === "STUDENT";
  }, [user]);

  const logout = async () => {
    // NextAuth 세션 종료
    await signOut({ redirect: false });

    toast.success(AUTH_MESSAGES.LOGOUT.SUCCESS);

    window.location.href = "/courses";
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isInstructor,
    isStudent,
    logout,
  };
}
