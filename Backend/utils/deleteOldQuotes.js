const {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
  writeBatch,
  getDoc,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");
const sendEmail = require("./emailjsUtils");
const { formatEmailBody, wrapEmailBody } = require("./formateEmail");

const collectionsToCheck = [
  "home_quotes",
  "flood_quote",
  "liability_quotes",
  "auto_quotes",
];

async function deleteOldQuotes() {
  try {
    const now = Timestamp.now();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 91);
    const ninetyDaysAgoTimestamp = Timestamp.fromDate(ninetyDaysAgo);

    for (const col of collectionsToCheck) {
      const colRef = collection(db, col);
      const q = query(colRef, where("createdAt", "<=", ninetyDaysAgoTimestamp));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`No old documents found in ${col}`);
        continue;
      }

      snapshot.forEach(async (doc) => {
        const data = doc.data();
        // Manually filter status_step === "2" meaning it is not bounded yet
        if (data.status_step === "2") {
          await deleteDoc(doc.ref);
          console.log(`Deleted document with ID ${doc.id} from ${col}`);
        }
      });
    }
  } catch (error) {
    console.error("Error deleting old quotes:", error);
  }
}

async function findExpiredBoundPolicies() {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoTimestamp = Timestamp.fromDate(sixMonthsAgo);

    const boundPoliciesRef = collection(db, "bound_policies");
    const q = query(
      boundPoliciesRef,
      where("createdAt", "<=", sixMonthsAgoTimestamp)
    );

    //For One day to test it out

    // const oneDayAgo = new Date();
    // oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Subtract 1 day
    // const oneDayAgoTimestamp = Timestamp.fromDate(oneDayAgo);

    // const boundPoliciesRef = collection(db, "bound_policies");
    // const q = query(
    //   boundPoliciesRef,
    //   where("createdAt", "<=", oneDayAgoTimestamp)
    // );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No expired bound policies found.");
      return;
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const { qid, qsr_type } = data;

      if (!qid || !qsr_type) {
        console.warn(
          `Skipping document ${doc.id} due to missing qid or qsr_type`
        );
        continue;
      }

      // Convert qsr_type to lowercase and construct the collection name
      const quotesCollectionName = `${qsr_type.toLowerCase()}_quotes`;

      console.log(`Searching in ${quotesCollectionName} for qid: ${qid}`);

      const quotesRef = collection(db, quotesCollectionName);
      const quoteQuery = query(quotesRef, where("__name__", "==", qid));
      const quoteSnapshot = await getDocs(quoteQuery);

      if (!quoteSnapshot.empty) {
        for (const quoteDoc of quoteSnapshot.docs) {
          console.log(
            `Deleting document with ID ${qid} from ${quotesCollectionName}`
          );
          await deleteDoc(quoteDoc.ref);
          console.log(`Deleted document with ID ${qid}`);
        }
      } else {
        console.log(
          `No matching document found for qid: ${qid} in ${quotesCollectionName}`
        );
      }

      // Check in bind_req_quotes where qid matches
      const bindReqRef = collection(db, "bind_req_quotes");
      const bindReqQuery = query(bindReqRef, where("qid", "==", qid));
      const bindReqSnapshot = await getDocs(bindReqQuery);

      if (!bindReqSnapshot.empty) {
        for (const bindDoc of bindReqSnapshot.docs) {
          console.log(
            `Deleting document with ID ${bindDoc.id} from bind_req_quotes`
          );
          await deleteDoc(bindDoc.ref);
          console.log(`Deleted document with ID ${bindDoc.id}`);
        }
      } else {
        console.log(
          `No matching document found for qid: ${qid} in bind_req_quotes`
        );
      }

      // Check in prep_quotes where q_id matches
      const prepRef = collection(db, "prep_quotes");
      const prepQuery = query(prepRef, where("q_id", "==", qid));
      const prepSnapshot = await getDocs(prepQuery);

      if (!prepSnapshot.empty) {
        for (const prepDoc of prepSnapshot.docs) {
          console.log(
            `Deleting document with ID ${prepDoc.id} from prep_quotes`
          );
          await deleteDoc(prepDoc.ref);
          console.log(`Deleted document with ID ${prepDoc.id}`);
        }
      } else {
        console.log(
          `No matching document found for qid: ${qid} in prep_quotes`
        );
      }
    }
  } catch (error) {
    console.error("Error finding and deleting expired bound policies:", error);
  }
}
//for the standard templates
async function findExpiredPolicies() {
  try {
    console.log("Starting findExpiredPolicies...");
    const today = new Date();

    // Calculate 10 months ahead
    const tenMonthsAhead = new Date(today);
    tenMonthsAhead.setMonth(today.getMonth() + 10);
    if (tenMonthsAhead.getMonth() !== (today.getMonth() + 10) % 12) {
      tenMonthsAhead.setDate(0); // Adjust for month overflow
    }
    tenMonthsAhead.setHours(0, 0, 0, 0); // Normalize time

    // Define a flexible range: ±5 days
    const rangeStart = new Date(tenMonthsAhead);
    rangeStart.setDate(rangeStart.getDate() - 5);

    const rangeEnd = new Date(tenMonthsAhead);
    rangeEnd.setDate(rangeEnd.getDate() + 5);

    // Convert to 'YYYY-MM-DD' string format
    const formatDate = (date) => date.toISOString().split("T")[0];

    const startStr = formatDate(rangeStart);
    const endStr = formatDate(rangeEnd);

    console.log(
      "Querying policies with effective_date between:",
      startStr,
      "and",
      endStr
    );
    const boundPoliciesRef = collection(db, "bound_policies");

    // Query with string comparisons
    const q = query(
      boundPoliciesRef,
      where("byReferral", "==", true),
      where("effective_date", ">=", startStr), // String comparison
      where("effective_date", "<=", endStr) // String comparison
    );

    // Execute query
    const filteredSnapshot = await getDocs(q);

    console.log(
      "Query executed. Found documents count:",
      filteredSnapshot.size
    );

    // Map documents to array
    const policies = filteredSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    if (policies.length > 0) {
      console.log(`Found ${policies.length} policies to process.`);
      await processPolicies(policies);
    } else {
      console.log("No policies found for processing.");
    }
  } catch (error) {
    console.error("Error fetching bound policies:", error);
  }
}

async function processPolicies(policies) {
  for (const policy of policies) {
    try {
      console.log("Processing policy for referral:", policy?.Referral);

      const referral = policy?.Referral;
      if (!referral || !referral.id) {
        console.warn("Missing referral data, skipping policy.");
        continue;
      }

      // Fetch standard email template
      const templateRef = doc(db, "emailTemplates", "standard");
      const templateDoc = await getDoc(templateRef);
      const template = templateDoc.data();

      // Fetch logo URL from referralLogos collection
      const logoRef = doc(db, "referralLogos", referral?.id);
      const logoDoc = await getDoc(logoRef);
      const logoUrl = logoDoc.exists() ? logoDoc.data()?.logoUrl : null;

      console.log("Fetched logo URL:", logoUrl);

      // Replace placeholders in the subject and body
      const emailSubject = template.subject.replace(
        /{referralName}/g,
        referral.name
      );

      let emailBody = template.body
        ?.replace(/{referralName}/g, referral?.name)
        ?.replace(/{policyEffectiveDate}/g, policy?.effective_date);

      // Insert logo based on logoPosition
      emailBody = formatEmailBody(emailBody, logoUrl, template.logoPosition);

      console.log("Sending mail to:", policy?.user?.email);
      // Send email using EmailJS
      const emailSent = await sendEmail(
        policy?.user?.email,
        emailSubject,
        emailBody
      );

      if (emailSent) {
        console.log(` Email sent successfully to ${policy.user.email}`);
      } else {
        console.log(` Failed to send email to ${policy.user.email}`);
      }
    } catch (error) {
      console.error(`Error processing policy ${policy.id}:`, error);
    }
  }
}

//for the custom templates

async function findExpiredCustomPolicies() {
  try {
    console.log("Starting findExpiredPolicies...");
    const today = new Date();

    // Define intervals in months
    const intervals = [6, 12, 18, 24];

    for (const interval of intervals) {
      // Calculate the target date for the current interval
      const targetDate = new Date(today);
      targetDate.setMonth(today.getMonth() + interval);
      if (targetDate.getMonth() !== (today.getMonth() + interval) % 12) {
        targetDate.setDate(0); // Adjust for month overflow
      }
      targetDate.setHours(0, 0, 0, 0); // Normalize time

      // Define a flexible range: ±5 days
      const rangeStart = new Date(targetDate);
      rangeStart.setDate(rangeStart.getDate() - 5);

      const rangeEnd = new Date(targetDate);
      rangeEnd.setDate(rangeEnd.getDate() + 5);

      // Convert to 'YYYY-MM-DD' string format
      const formatDate = (date) => date.toISOString().split("T")[0];

      const startStr = formatDate(rangeStart);
      const endStr = formatDate(rangeEnd);

      console.log(
        `Querying policies with effective_date between ${startStr} and ${endStr} (${interval} months interval)...`
      );

      const boundPoliciesRef = collection(db, "bound_policies");

      // Query with string comparisons
      const q = query(
        boundPoliciesRef,
        where("byReferral", "==", true),
        where("effective_date", ">=", startStr), // String comparison
        where("effective_date", "<=", endStr) // String comparison
      );

      // Execute query
      const filteredSnapshot = await getDocs(q);

      console.log(
        `Found ${filteredSnapshot.size} policies for ${interval} months interval.`
      );

      // Map documents to array
      const policies = filteredSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          interval, // Add interval to the policy object
        };
      });

      if (policies.length > 0) {
        console.log(
          `Processing ${policies.length} policies for ${interval} months interval...`
        );
        await processCustomPolicies(policies, interval);
      } else {
        console.log(`No policies found for ${interval} months interval.`);
      }
    }
  } catch (error) {
    console.error("Error fetching bound policies:", error);
  }
}

async function processCustomPolicies(policies, interval) {
  for (const policy of policies) {
    try {
      console.log("Processing policy for referral:", policy?.Referral);

      const referral = policy?.Referral;
      if (!referral || !referral.id) {
        console.warn("Missing referral data, skipping policy.");
        continue;
      }

      // Fetch custom template for the referral
      const customTemplateRef = doc(db, "customTemplates", referral.id);
      const customTemplateDoc = await getDoc(customTemplateRef);

      if (!customTemplateDoc.exists()) {
        console.log(
          `No custom template found for referral ${referral.id}, skipping.`
        );
        continue;
      }

      const customTemplate = customTemplateDoc.data();

      // Check if the interval matches the trigger interval
      if (
        Number.parseInt(customTemplate.interval, 10) !==
        Number.parseInt(interval, 10)
      ) {
        console.log(
          `Trigger interval (${Number.parseInt(
            customTemplate.interval,
            10
          )}) does not match current interval (${Number.parseInt(
            interval,
            10
          )}), skipping.`
        );
        continue;
      }

      // Fetch logo URL from referralLogos collection
      const logoRef = doc(db, "referralLogos", referral?.id);
      const logoDoc = await getDoc(logoRef);
      const logoUrl = logoDoc.exists() ? logoDoc.data()?.logoUrl : null;

      console.log("Fetched logo URL:", logoUrl);

      // Replace placeholders in the subject and body
      const emailSubject = customTemplate?.subject?.replace(
        /{referralName}/g,
        referral.name
      );

      let emailBody = customTemplate?.body
        ?.replace(/{referralName}/g, referral?.name)
        ?.replace(/{policyEffectiveDate}/g, policy?.effective_date);

      // Insert logo based on logoPosition
      emailBody = formatEmailBody(
        emailBody,
        logoUrl,
        customTemplate.logoPosition
      );

      console.log("Sending mail to:", policy?.user?.email);
      // Send email using EmailJS
      const emailSent = await sendEmail(
        policy?.user?.email,
        emailSubject,
        emailBody
      );

      if (emailSent) {
        console.log(`Email sent successfully to ${policy.user.email}`);
      } else {
        console.log(`Failed to send email to ${policy.user.email}`);
      }
    } catch (error) {
      console.error(`Error processing policy ${policy.id}:`, error);
    }
  }
}
module.exports = {
  deleteOldQuotes,
  findExpiredBoundPolicies,
  findExpiredPolicies,
  findExpiredCustomPolicies,
};
