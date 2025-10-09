/**
 * Router for QuoteRush API integration.
 * @module quoterush/index
 */

const express = require("express");
const { validate } = require("uuid");
const { buildPayload } = require("./payloadBuilder");
const { submitToQuoteRush } = require("./apiClient");
const { logSubmission } = require("./loggingService");
const { storeFailedSubmission } = require("./retryService");
const { doc, updateDoc } = require("firebase/firestore");
const { db } = require("../firebase");

const router = express.Router();

/**
 * Handles POST /submit endpoint for QuoteRush submissions.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post("/submit", async (req, res) => {
  const { quoteId, quoteType, quoteData } = req.body;

  // // Validate input
  // if (!validate(quoteId)) {
  //   return res
  //     .status(400)
  //     .json({ error: "Invalid quoteId: Must be a valid UUID" });
  // }
  if (!quoteId) {
    return res.status(400).json({ error: "Invalid quoteId: Missing or empty" });
  }
  if (!["Home", "Auto", "Flood"].includes(quoteType)) {
    return res
      .status(400)
      .json({ error: "Invalid quoteType: Must be Home, Auto, or Flood" });
  }
  if (!quoteData || typeof quoteData !== "object") {
    return res
      .status(400)
      .json({ error: "Invalid quoteData: Must be a non-empty object" });
  }

  // Return 202 Accepted immediately
  res.status(202).json({ message: "Request accepted for processing" });
  let payload;
  try {
    // Build payload
    payload = buildPayload(quoteType, quoteData);
    console.log("Payload built for QuoteRush:", payload);

    // Submit to QuoteRush
    const { status, data, leadId } = await submitToQuoteRush(payload);

    // // Update original quote
    await updateDoc(doc(db, `${quoteType.toLowerCase()}_quotes`, quoteId), {
      quoterush_submitted: true,
      quoterush_lead_id: leadId || null,
    });

    // Log submission
    await logSubmission(
      quoteId,
      quoteType,
      payload || null,
      status,
      data,
      leadId,
      true,
      null
    );
  } catch (error) {
    // Log failure
    await logSubmission(
      quoteId,
      quoteType,
      payload || null,
      0,
      "",
      null,
      false,
      error.message
    );

    // Store for retry
    await storeFailedSubmission(quoteId, quoteType, payload, error.message);
  }
});

module.exports = router;
