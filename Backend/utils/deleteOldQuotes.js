const {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
  writeBatch,
} = require("firebase/firestore");
const { db } = require("../firebase");

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

module.exports = { deleteOldQuotes, findExpiredBoundPolicies };
