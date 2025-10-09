/**
 * Module for interacting with the QuoteRush API.
 * @module quoterush/apiClient
 */

const axios = require("axios");
const config = require("./config");

/**
 * Submits payload to QuoteRush API.
 * @param {Object} payload - QuoteRush API payload
 * @returns {Promise<{ status: number, data: string, leadId: string | null }>} Response details
 */
async function submitToQuoteRush(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload: Must be a non-empty object");
  }

  try {
    const response = await axios.post(
      `${config.QUOTERUSH_API_URL}/${config.QUOTERUSH_WEB_ID}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          webpassword: config.QUOTERUSH_WEB_PASSWORD,
        },
      }
    );

    const leadIdMatch = String(response.data).match(/Lead #(\d+)/);
    const leadId = leadIdMatch ? leadIdMatch[1] : null;

    console.log("QuoteRush Submission Successful:");
    console.log(`Status: ${response.status}`);
    console.log(`Lead ID: ${leadId}`);
    console.log("Response:", response.data);

    return {
      status: response.status,
      data: response.data,
      leadId,
    };
  } catch (error) {
    console.error("QuoteRush API Error:");
    console.error(error.response?.data || error.message);
    throw new Error(`QuoteRush API error: ${error.message}`);
  }
}

module.exports = { submitToQuoteRush };
