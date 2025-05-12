import { AutocompleteOption } from "@/lib/types/common";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentSearch = {
  origin: AutocompleteOption;
  destination: AutocompleteOption;
};

type RecentSearchStore = {
  recentSearches: RecentSearch[];
  addRecentSearch: (search: RecentSearch) => void;
  clearRecentSearches: () => void;
};

export const useRecentSearches = create<RecentSearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (search: RecentSearch) => {
        const current = get().recentSearches.filter(
          (s) =>
            s.origin.value !== search.origin.value ||
            s.destination.value !== search.destination.value
        );

        if (current.length >= 5) current.pop();

        set({ recentSearches: [search, ...current] });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "recentSearches",
    }
  )
);
