import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserInfo = {
  sub: string;
  full_name: string;
  email: string;
  avatar: string;
  exp: number;
};

export type UserInfoState = {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
};

export const useUserInfo = create<UserInfoState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),
    }),
    { name: "userInfo" }
  )
);
