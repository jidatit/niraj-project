/**
 * Configuration module for QuoteRush integration.
 * @module quoterush/config
 */

/**
 * Loads configuration from environment variables.
 * @returns {Object} Configuration object
 * @throws {Error} If required environment variables are missing
 */
function loadConfig() {
  const QUOTERUSH_WEB_ID = process.env.QUOTERUSH_WEB_ID;
  const QUOTERUSH_WEB_PASSWORD = process.env.QUOTERUSH_WEB_PASSWORD;

  if (!QUOTERUSH_WEB_ID) {
    throw new Error("QUOTERUSH_WEB_ID environment variable is required");
  }
  if (!QUOTERUSH_WEB_PASSWORD) {
    throw new Error("QUOTERUSH_WEB_PASSWORD environment variable is required");
  }

  return {
    QUOTERUSH_WEB_ID,
    QUOTERUSH_WEB_PASSWORD,
    QUOTERUSH_API_URL: "https://importer.quoterush.com/Json/Import",
  };
}

module.exports = loadConfig();
