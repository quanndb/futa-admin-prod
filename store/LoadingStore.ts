import { create } from "zustand";

export type LoadingState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useLoading = create<LoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
