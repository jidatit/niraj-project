/**
 * Module for logging QuoteRush submissions to Firestore.
 * @module quoterush/loggingService
 */

const {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} = require("firebase/firestore");
const { db } = require("../firebase");

/**
 * Sanitizes payload to remove PII.
 * @param {Object} payload - QuoteRush API payload
 * @returns {Object} Sanitized payload
 */
function sanitizePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {}; // return empty object if undefined, null, or not an object
  }

  const sanitized = { ...payload };

  if (sanitized.Client && typeof sanitized.Client === "object") {
    sanitized.Client = {
      ...sanitized.Client,
      NameFirst: "[REDACTED]",
      NameMiddle: "[REDACTED]",
      NameLast: "[REDACTED]",
      PhoneNumber: "[REDACTED]",
      PhoneNumberAlt: "[REDACTED]",
      PhoneCell: "[REDACTED]",
      EmailAddress: "[REDACTED]",
      Address: "[REDACTED]",
      Address2: "[REDACTED]",
      City: "[REDACTED]",
      State: "[REDACTED]",
      Zip: "[REDACTED]",
      CoApplicantNameFirst: "[REDACTED]",
      CoApplicantNameMiddle: "[REDACTED]",
      CoApplicantNameLast: "[REDACTED]",
      CoApplicantEmail: "[REDACTED]",
      CoApplicantPhone: "[REDACTED]",
    };
  }

  if (Array.isArray(sanitized.Drivers)) {
    sanitized.Drivers = sanitized.Drivers.map((driver) =>
      typeof driver === "object" && driver
        ? {
            ...driver,
            NameFirst: "[REDACTED]",
            NameMiddle: "[REDACTED]",
            NameLast: "[REDACTED]",
            LicenseNumber: "[REDACTED]",
            SSN: "[REDACTED]",
          }
        : driver
    );
  }

  return sanitized;
}

/**
 * Logs a submission attempt to Firestore.
 */
async function logSubmission(
  quoteId,
  quoteType,
  requestPayload,
  responseStatus,
  responseBody,
  leadId,
  success,
  error
) {
  try {
    // const sanitizedPayload = sanitizePayload(requestPayload);
    const submissionRef = doc(collection(db, "quoterush_submissions"));

    await setDoc(submissionRef, {
      quote_id: quoteId || null,
      quote_type: quoteType || null,
      submitted_at: serverTimestamp(),
      request_payload: requestPayload || {}, // ← store exact payload
      response_status: responseStatus || null,
      response_body: responseBody || null,
      lead_id: leadId || null,
      success: !!success,
      error: error || null,
    });
  } catch (logError) {
    console.error("Error logging submission:", logError);
  }
}

module.exports = { logSubmission, sanitizePayload };
