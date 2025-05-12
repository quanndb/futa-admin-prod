import { UserInfo } from "@/store/AuthStore";
import { jwtDecode } from "jwt-decode";

export const authStorage = {
  saveTokens: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
};

export const JwtDecoder = {
  getUserInfo: () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      return jwtDecode(token) as UserInfo;
    }
    return null;
  },
};
