const moment = require("moment");
const {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");
const {
  sendRenewalQuoteNotifications,
} = require("./sendRenewalQuoteNotifications");
/**
 * Processes renewal quotes older than 24 hours and creates new prep_quotes
 */
async function processRenewalQuotes() {
  try {
    const now = moment();
    const twentyFourHoursAgo = now.subtract(24, "hours").toISOString();

    // Query unprocessed renewal quotes older than 24 hours
    const renewalQuotesQuery = query(
      collection(db, "renewal_quotes"),
      // where("receivedAt", "<=", twentyFourHoursAgo),
      where("processed", "==", false)
    );

    const renewalQuotesSnapshot = await getDocs(renewalQuotesQuery);
    const renewalQuotes = renewalQuotesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (renewalQuotes.length === 0) {
      console.log("No renewal quotes to process");
      return;
    }

    console.log(`Processing ${renewalQuotes.length} renewal quotes`);

    for (const quote of renewalQuotes) {
      try {
        await createNewPrepQuoteFromRenewal(quote);
      } catch (error) {
        console.error(`Error processing quote ${quote.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in processRenewalQuotes:", error);
  }
}

async function createNewPrepQuoteFromRenewal(renewalQuote) {
  try {
    // 1. Try to find the most recent previous prep quote
    const previousQuotesQuery = query(
      collection(db, "prep_quotes"),
      where("user.email", "==", renewalQuote?.Email?.toLowerCase())
    );

    const previousQuotesSnapshot = await getDocs(previousQuotesQuery);
    const previousQuotes = previousQuotesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const mostRecentQuote = previousQuotes.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    // 2. If no previous quote found, try to get user data from bound_policies
    let userData = null;
    let table1Data = []; // Empty table_1 if no previous quote

    // Prepare referral info defaults
    let byReferral = false;
    let ReferralId = "";
    let Referral = "";

    if (!mostRecentQuote) {
      console.log("No previous quote found for email:", renewalQuote?.Email);

      // Try to get user data from bound_policies
      const boundPoliciesQuery = query(
        collection(db, "bound_policies"),
        where("user.email", "==", renewalQuote?.Email?.toLowerCase()),
        limit(1)
      );

      const boundPoliciesSnapshot = await getDocs(boundPoliciesQuery);
      if (!boundPoliciesSnapshot.empty) {
        const latestPolicy = boundPoliciesSnapshot.docs[0].data();
        userData = latestPolicy.user;
        // Bring referral info from bound policy
        byReferral = latestPolicy.user?.byReferral || false;
        ReferralId = latestPolicy.user?.ReferralId || "";
        Referral = latestPolicy.user?.Referral || "";
      } else {
        // Fallback to minimal user data from renewal quote
        userData = {
          email: renewalQuote.Email,
          name: "",
          address: renewalQuote.Address || "",
          zipCode: renewalQuote.ZipCode || "",
          phoneNumber: "",
          mailingAddress: renewalQuote.Address || "",
          label: renewalQuote.Email,
          value: renewalQuote.Email,
        };
        // No referral info
      }
    } else {
      // Use data from existing prep quote
      userData = mostRecentQuote.user;
      table1Data = [...mostRecentQuote.tablesData.table_1];
      // Bring referral info from previous prep quote
      byReferral = mostRecentQuote.user?.byReferral || false;
      ReferralId = mostRecentQuote.user?.ReferralId || "";
      Referral = mostRecentQuote.user?.Referral || "";
    }

    // 3. Get all unprocessed renewal quotes for this email
    const renewalQuotesForEmailQuery = query(
      collection(db, "renewal_quotes"),
      where("Email", "==", renewalQuote?.Email),
      where("processed", "==", false)
    );

    const renewalQuotesSnapshot = await getDocs(renewalQuotesForEmailQuery);
    const allRenewalQuotes = renewalQuotesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (allRenewalQuotes.length === 0) {
      console.log(
        "No unprocessed renewal quotes found for email:",
        renewalQuote?.Email
      );
      return;
    }

    // 4. Create new table_2 from renewal quotes
    const newTable2 = allRenewalQuotes.map((rq) => ({
      id: rq.id,
      carrier: rq.Carrier || " ",
      premium: rq.ReturnAmount || "0.00",
      address: rq.Address || userData.address,
      zipCode: rq.zipCode || userData.zipCode,
      email: rq.Email || userData.email,
    }));

    // 5. Create the new prep_quote
    const newPrepQuote = {
      date: moment().format("MM/DD/YYYY"),
      isRenewal: true,
      renewalSourceIds: allRenewalQuotes.map((q) => q.id),
      user: userData,
      tablesData: {
        table_1: table1Data, // Empty if no previous quote
        table_2: newTable2,
      },
      agent: mostRecentQuote?.agent || null,
      notes: ["Automatically generated from renewal quotes"],
      byReferral,
      ReferralId,
      Referral,
    };

    console.log("New prep quote:", JSON.stringify(newPrepQuote, null, 2));

    // // 6. Save to Firestore and mark renewals as processed
    // await addDoc(collection(db, "prep_quotes"), newPrepQuote);
    // const updatePromises = allRenewalQuotes.map(async (rq) => {
    //   const renewalQuoteRef = doc(db, "renewal_quotes", rq.id);
    //   await updateDoc(renewalQuoteRef, {
    //     processed: true,
    //     processedAt: new Date().toISOString(),
    //   });
    // });
    // await Promise.all(updatePromises);

    await sendRenewalQuoteNotifications(db, newPrepQuote, renewalQuote);

    console.log(
      `Created new prep_quote with ${newTable2.length} carriers from ${allRenewalQuotes.length} renewal quotes`
    );
    return newPrepQuote;
  } catch (error) {
    console.error("Error in createNewPrepQuoteFromRenewal:", error);
    throw error;
  }
}

module.exports = { processRenewalQuotes };
