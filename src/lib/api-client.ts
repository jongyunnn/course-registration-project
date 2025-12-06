import axios from "axios";
import { getSession } from "next-auth/react";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 헤더 추가를 위한 요청 인터셉터
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user) {
      config.headers["x-user-id"] = session.user.id;
      config.headers["x-user-type"] = session.user.userType;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);
