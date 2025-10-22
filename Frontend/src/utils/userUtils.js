// utils/userUtils.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../db";
import { getReferral } from "./referralUtils";

/**
 * Batch-fetch users by emails and return map of email -> referralMeta.
 * Handles 'in' limit by chunking.
 */
export const batchGetReferralMetaByEmails = async (emails) => {
  const uniqueEmails = [...new Set(emails.filter(Boolean))]; // De-dupe and filter falsy
  const referralMap = {};

  // Chunk into groups of 30 (Firestore 'in' limit)
  for (let i = 0; i < uniqueEmails.length; i += 30) {
    const chunk = uniqueEmails.slice(i, i + 30);
    const userQuery = query(
      collection(db, "users"),
      where("email", "in", chunk)
    );
    const userSnap = await getDocs(userQuery);
    for (const doc of userSnap.docs) {
      const user = { uid: doc.id, data: doc.data() };
      const meta = await getReferral(user);
      const email = user.data?.email?.toLowerCase(); // Normalize case
      referralMap[email] = {
        hasReferral: !!meta.byReferral,
        name: meta.Referral?.name || "",
        email: meta.Referral?.email || "",
        id: meta.ReferralId || "",
      };
    }
  }

  return referralMap;
};
