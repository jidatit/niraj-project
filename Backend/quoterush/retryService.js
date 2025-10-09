/**
 * Module for handling retries of failed QuoteRush submissions.
 * @module quoterush/retryService
 */

const {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require("../firebase");
const { submitToQuoteRush } = require("./apiClient");
const { logSubmission } = require("./loggingService");

/**
 * Stores a failed submission for retry.
 * @param {string} quoteId - Quote ID
 * @param {string} quoteType - Quote type
 * @param {Object} payload - QuoteRush API payload
 * @param {string} error - Error message
 * @returns {Promise<void>}
 */
async function storeFailedSubmission(quoteId, quoteType, payload, error) {
  try {
    const failedRef = doc(collection(db, "quoterush_failed_submissions"));

    await setDoc(failedRef, {
      quote_id: quoteId || null,
      quote_type: quoteType || null,
      payload: payload && typeof payload === "object" ? payload : {},
      error: error?.toString() || "Unknown error",
      retry_count: 0,
      next_retry_at: serverTimestamp(),
      created_at: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error storing failed submission:", err);
  }
}

/**
 * Processes retries for failed submissions with exponential backoff.
 * @returns {Promise<void>}
 */
async function processRetries() {
  const now = new Date();
  const backoffDelays = [5 * 60 * 1000, 10 * 60 * 1000, 20 * 60 * 1000]; // 5min, 10min, 20min

  const q = query(
    collection(db, "quoterush_failed_submissions"),
    where("retry_count", "<", 3),
    where("next_retry_at", "<=", Timestamp.fromDate(now))
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const { quote_id, quote_type, payload, retry_count } = docSnap.data();
    const docRef = doc(db, "quoterush_failed_submissions", docSnap.id);

    try {
      const { status, data, leadId } = await submitToQuoteRush(payload);
      await logSubmission(
        quote_id,
        quote_type,
        payload,
        status,
        data,
        leadId,
        true,
        null
      );

      // Update original quote
      await updateDoc(doc(db, `${quote_type.toLowerCase()}_quotes`, quote_id), {
        quoterush_submitted: true,
        quoterush_lead_id: leadId || null,
      });

      // Remove from failed submissions
      await deleteDoc(docRef);
    } catch (error) {
      const newRetryCount = retry_count + 1;
      const nextRetryAt = new Date(
        now.getTime() + backoffDelays[newRetryCount] || backoffDelays[2]
      );

      await logSubmission(
        quote_id,
        quote_type,
        payload,
        0,
        "",
        null,
        false,
        error.message
      );

      if (newRetryCount < 3) {
        await updateDoc(docRef, {
          retry_count: newRetryCount,
          next_retry_at: Timestamp.fromDate(nextRetryAt),
          last_error: error.message,
        });
      } else {
        await updateDoc(docRef, {
          retry_count: newRetryCount,
          last_error: error.message,
        });
      }
    }
  }
}

// Schedule retries (e.g., every 5 minutes)
setInterval(processRetries, 5 * 60 * 1000);

module.exports = { storeFailedSubmission, processRetries };
