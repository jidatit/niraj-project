/**
 * Utility functions for client-side API calls to QuoteRush.
 * @module quoterush/clientUtils
 */

import axiosInstance from "./axiosConfig";

/**
 * Submits a quote to the QuoteRush API.
 * @param {string} quoteId - Firestore document ID for the quote
 * @param {string} quoteType - Type of quote (Home, Auto, Flood)
 * @param {Object} quoteData - Quote data
 * @returns {Promise<void>}
 * @throws {Error} If the API call fails
 */
export async function submitQuoteToQuoteRush(quoteId, quoteType, quoteData) {
  if (!["Home", "Auto", "Flood"].includes(quoteType)) {
    throw new Error("Invalid quoteType: Must be Home, Auto, or Flood");
  }
  try {
    const response = await axiosInstance.post("/api/quoterush/submit", {
      quoteId,
      quoteType,
      quoteData,
    });
    if (response.status === 202) {
      console.log(
        `QuoteRush submission for ${quoteType} quote ${quoteId} accepted for processing`
      );
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(
      `Failed to submit ${quoteType} quote to QuoteRush for quote ${quoteId}:`,
      error.message
    );
    throw new Error(
      `QuoteRush ${quoteType} submission failed. Please retry later.`
    );
  }
}
