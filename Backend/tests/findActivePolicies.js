const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} = require("firebase/firestore");
const { db } = require("../firebase");
async function fetchQuotesWithEmailAndReceivedAt() {
  try {
    // 1. Fetch documents where 'Email' and 'receivedAt' exist (not null)
    console.log("Fetching quotes where both Email and receivedAt exist...");

    const quotesQuery = query(
      collection(db, "cms_quotes"),
      where("isRenewal", "==", false) // Ensure 'receivedAt' exists
    );

    const quotesSnapshot = await getDocs(quotesQuery);
    const results = [];

    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      results.push({
        id: doc.id,
        email: quote.Email,
        carrier: quote.carrier,
        // receivedAt: quote.receivedAt?.toDate()?.toString(),
        // status: quote.status,
      });
    });

    // Log the results to the console
    console.log(`Found ${results.length} matching quotes:`);
    results.forEach((quote) => {
      console.log(
        `Email: ${quote.email} | Carrier: ${quote.carrier} | ` +
          `Received: ${quote.receivedAt} | Status: ${quote.status}`
      );
    });
  } catch (error) {
    console.error("Error fetching quotes with Email and receivedAt:", error);
  }
}

async function findPolicyEmailsWithQuotes() {
  try {
    // 1. First get all unique emails from bound_policies
    console.log("Fetching all policy emails...");
    const policiesQuery = query(
      collection(db, "bound_policies"),
      where("user.email", "!=", null) // Only policies with emails
    );

    const policySnapshot = await getDocs(policiesQuery);
    const policyEmails = new Set();

    policySnapshot.forEach((doc) => {
      const email = doc.data().user.email?.toLowerCase();
      if (email) policyEmails.add(email);
    });

    console.log(`Found ${policyEmails.size} unique policy emails`);

    // 2. Now query cms_quotes only for these emails with receivedAt
    console.log("Fetching matching quotes...");
    const quotesQuery = query(
      collection(db, "cms_quotes"),
      where("Email", "in", [...policyEmails]), // Convert Set to array
      where("receivedAt", "!=", null)
    );

    const quotesSnapshot = await getDocs(quotesQuery);
    const results = [];

    quotesSnapshot.forEach((doc) => {
      const quote = doc.data();
      results.push({
        id: doc.id,
        email: quote.user.email,
        carrier: quote.carrier,
        receivedAt: quote.receivedAt?.toDate()?.toString(),
        status: quote.status,
      });
    });

    console.log(`Found ${results.length} matching quotes`);
    return results;
  } catch (error) {
    console.error("Error in findPolicyEmailsWithQuotes:", error);
    throw error;
  }
}

async function runOptimizedTest() {
  try {
    console.log("Starting optimized test...");
    const startTime = Date.now();
    await fetchQuotesWithEmailAndReceivedAt();
    const matchingQuotes = await findPolicyEmailsWithQuotes();

    console.log("\nResults:");
    matchingQuotes.forEach((quote) => {
      console.log(
        `Email: ${quote.email} | Carrier: ${quote.carrier} | ` +
          `Received: ${quote.receivedAt} | Status: ${quote.status}`
      );
    });

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\nCompleted in ${duration.toFixed(2)} seconds`);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// runOptimizedTest().catch(console.error);
module.exports = { runOptimizedTest, findPolicyEmailsWithQuotes };
