import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { LoginFormData } from "../lib/validation";

interface LoginResult {
  success: boolean;
  error?: string;
}

export const useLogin = () => {
  return useMutation<LoginResult, Error, LoginFormData>({
    mutationFn: async (data) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      return { success: true };
    },
  });
};
