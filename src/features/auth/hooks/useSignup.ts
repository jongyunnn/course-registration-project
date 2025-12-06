import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { authApi } from "../api";
import { SignupFormData } from "../lib/validation";
import { ApiErrorResponse, ApiResponse, User } from "@/types";

export const useSignup = () => {
  return useMutation<
    ApiResponse<User>,
    AxiosError<ApiErrorResponse>,
    SignupFormData
  >({
    mutationFn: (data) => {
      const { confirmPassword, ...requestData } = data;
      return authApi.signup(requestData);
    },
  });
};
