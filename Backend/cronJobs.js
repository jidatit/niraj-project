const cron = require("node-cron");
const {
  deleteOldQuotes,
  findExpiredBoundPolicies,
  findExpiredPolicies,
  findExpiredCustomPolicies,
} = require("./utils/deleteOldQuotes");
const { processPolicies } = require("./utils/personnelEmail");

// Schedule the cron job to run every minute for testing
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cleanup process...");
  await deleteOldQuotes();
  await findExpiredBoundPolicies();
  await findExpiredPolicies();
  await findExpiredCustomPolicies();
  await processPolicies();
});

console.log("Cron job initialized and running every minute.");
