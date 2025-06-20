import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchAllQuotesFromFirebase } from "./fetchQuotes";

export const useQuotesStore = create(
  persist(
    (set) => ({
      quotes: [],
      loading: false,
      error: null,

      fetchQuotes: async () => {
        set({ loading: true, error: null });

        try {
          const snapshot = await fetchAllQuotesFromFirebase();
          const allQuotes = snapshot.docs.map((doc) => doc.data());
          console.log("all quotes", allQuotes);

          // Deduplicate by Email (keep latest by receivedAt)
          const emailMap = new Map();
          allQuotes.forEach((quote) => {
            const existing = emailMap.get(quote.Email);
            if (
              !existing ||
              new Date(quote.receivedAt) > new Date(existing.receivedAt)
            ) {
              emailMap.set(quote.Email, quote);
            }
          });

          const dedupedQuotes = Array.from(emailMap.values());
          console.log("deputedQuotes", dedupedQuotes);
          set({ quotes: dedupedQuotes, loading: false });
        } catch (err) {
          console.error(err);
          set({ error: err.message || "Fetch failed", loading: false });
        }
      },

      clearQuotes: () => set({ quotes: [] }),
    }),
    {
      name: "quotes-storage", // localStorage key
      partialize: (state) => ({ quotes: state.quotes }), // Only persist quotes array
    }
  )
);
