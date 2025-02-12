const cron = require("node-cron");
const {
  deleteOldQuotes,
  findExpiredBoundPolicies,
} = require("./utils/deleteOldQuotes");

// Schedule the cron job to run every minute for testing
cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup process...");
  await deleteOldQuotes();
  await findExpiredBoundPolicies();
});

console.log("Cron job initialized and running every minute.");
