import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchAllQuotesFromFirebase } from "./fetchQuotes";
import { batchGetReferralMetaByEmails } from "../utils/userUtils"; // From previous

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
          const allQuotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

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

          // Batch fetch referral meta
          const emails = dedupedQuotes.map(
            (quote) =>
              quote?.Email?.toLowerCase() || quote?.email?.toLowerCase()
          );
          const referralMap = await batchGetReferralMetaByEmails(emails);

          // Enrich quotes with referralInfo
          const enrichedQuotes = dedupedQuotes.map((quote) => {
            const email =
              quote.Email?.toLowerCase() || quote.email?.toLowerCase();
            const date = new Date(quote.receivedAt);
            const mm = (date.getMonth() + 1).toString().padStart(2, "0");
            const dd = date.getDate().toString().padStart(2, "0");
            const yyyy = date.getFullYear();

            return {
              ...quote,
              receivedAtFormatted: `${mm}-${dd}-${yyyy}`,
              referralInfo: referralMap[email] || {}, // Add referralInfo
            };
          });

          set({ quotes: enrichedQuotes, loading: false });
        } catch (err) {
          console.error(err);
          set({ error: err.message || "Fetch failed", loading: false });
        }
      },

      clearQuotes: () => set({ quotes: [] }),
    }),
    {
      name: "quotes-storage",
      partialize: (state) => ({ quotes: state.quotes }),
    }
  )
);
