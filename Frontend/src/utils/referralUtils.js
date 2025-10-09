// utils/referralUtils.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../db";

/**
 * Returns referral-related metadata for saving quotes.
 * Handles both direct referral signups and clients with assigned referrals.
 */
export const getReferralMeta = async (currentUser) => {
  if (!currentUser?.uid || !currentUser?.data) return {};

  const { signupType, hasReferral, referralId } = currentUser.data;

  // Case 1: Direct referral user
  if (signupType === "Referral") {
    return {
      byReferral: true,
      ReferralId: currentUser.uid,
      Referral: currentUser.data,
    };
  }

  // Case 2: Client with referral assigned by admin
  if (signupType === "Client" && hasReferral && referralId) {
    try {
      const refSnap = await getDoc(doc(db, "users", referralId));
      if (refSnap.exists()) {
        const refData = refSnap.data();
        return {
          byReferral: true,
          ReferralId: referralId,
          Referral: refData,
        };
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    }
  }

  // Default: No referral
  return {};
};
