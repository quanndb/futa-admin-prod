import axios from "@/services";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export type Profile = {
  id: string;
  email: string;
  avatarUrl?: string;
  fullName: string;
  gender?: Gender;
  phoneNumber?: string;
  createdAt: string;
};

export type UpdateProfile = {
  fullName?: string;
  gender?: Gender;
  phoneNumber?: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
};

const accountAPI = {
  getProfile: (): Promise<{ data: Profile }> => {
    const url = "/iam/api/v1/accounts/me";
    return axios.get(url);
  },
  register: (params: RegisterRequest) => {
    const url = "/iam/api/v1/accounts/register";
    return axios.post(url, params);
  },

  forgotPassword: (email: string) => {
    const url = "/iam/api/v1/accounts/forgot-password?email=" + email;
    return axios.post(url);
  },

  changePassword: (params: { oldPassword: string; newPassword: string }) => {
    const url = "/iam/api/v1/accounts/me/password";
    return axios.post(url, params);
  },

  setPassword: (newPassword: string) => {
    const url = "/iam/api/v1/accounts/action/password-verification";
    return axios.post(url, { newPassword });
  },

  updateProfile: (params: UpdateProfile) => {
    const url = "/iam/api/v1/accounts/me";
    return axios.put(url, params);
  },

  updateAvatar: (file: File) => {
    const url = "/iam/api/v1/accounts/me/avatar";
    const formData = new FormData();
    formData.append("image", file);
    return axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default accountAPI;
