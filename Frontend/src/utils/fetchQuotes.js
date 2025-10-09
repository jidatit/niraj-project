import { getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../../db";

export const fetchAllQuotesFromFirebase = async () => {
  const quotesCollection = collection(db, "renewal_quotes");

  // Order by 'receivedAt' in descending order (newest first)
  const q = query(quotesCollection, orderBy("receivedAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot;
};

/**
 * Fetch quotes from Firebase where Email matches,
 * then format, sort, and filter by carrier + premium.
 */
export const fetchQuotesByEmail = async (email) => {
  try {
    const quotesCollection = collection(db, "renewal_quotes");
    const q = query(
      quotesCollection,
      where("Email", "==", email.toLowerCase()),
      orderBy("receivedAt", "desc")
    );

    const snapshot = await getDocs(q);

    const filteredData = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .map((quote) => ({
        id: quote.id,
        email: quote.Email,
        address: quote.Address || "",
        zipCode: quote.zipCode || "",
        carrier: quote.Carrier || "",
        premium: parseFloat(quote.ReturnAmount) || 0,
        isProcessed: quote?.processed,
        boundPolicyId: quote?.boundPolicyId || "",
        boundPolicyCarrier: quote?.boundPolicyCarrier || "",
        boundPolicyEffectiveDate: quote?.boundPolicyEffectiveDate || "",
      }))
      .sort((a, b) => (b.premium > 0 ? 1 : -1))
      .filter(
        (quote, index, self) =>
          index ===
          self.findIndex(
            (q) => q.carrier === quote.carrier && q.premium === quote.premium
          )
      );

    return filteredData;
  } catch (error) {
    console.error("Error fetching quotes by email:", error);
    return [];
  }
};
