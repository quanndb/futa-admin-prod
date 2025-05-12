import axios from "@/services";
import { RegisterRequest } from "@/services/API/accountAPI";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserAuthority = {
  grantedPermissions: string[];
  isRoot: boolean;
  role?: string;
  userId: string;
};

const authAPI = {
  login: (params: LoginRequest) => {
    const url = "/iam/api/v1/auth/login";
    return axios.post(url, params);
  },
  register: (params: RegisterRequest) => {
    const url = "/iam/api/v1/accounts/register";
    return axios.post(url, params);
  },
  logout: () => {
    // const url = "/iam/api/v1/auth/logout";
    // return axios.post(url);
    localStorage.removeItem("accessToken");
  },
  loginWithGoogle: (code: string) => {
    const url = "/iam/api/v1/auth/providers/google?code=" + code;
    return axios.post(url);
  },
  macVerify: () => {
    const url = "/iam/api/v1/auth/action/mac-verification";
    return axios.post(url);
  },
  getMyAuthorities: (): Promise<{ data: UserAuthority }> => {
    const url = "/iam/api/v1/accounts/me/authorities";
    return axios.get(url);
  },
};

export default authAPI;
