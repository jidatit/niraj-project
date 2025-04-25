const {
  getDocs,
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  writeBatch,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");

/**
 * Pages through all renewal_quotes and sets processed:false
 * on any doc where `processed` is missing.
 */
async function backfillMissingProcessedFlag() {
  const colRef = collection(db, "renewal_quotes");
  const pageSize = 500;
  let lastDoc = null;
  let totalUpdated = 0;

  while (true) {
    // Build paged query
    let q = query(colRef, orderBy("__name__"), limit(pageSize));
    if (lastDoc) {
      q = query(
        colRef,
        orderBy("__name__"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snap = await getDocs(q);
    if (snap.empty) break;

    // Prepare a batch for this page
    const batch = writeBatch(db);
    let ops = 0;

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      if (!Object.prototype.hasOwnProperty.call(data, "processed")) {
        batch.update(doc(db, "renewal_quotes", docSnap.id), {
          processed: false,
        });
        ops++;
        totalUpdated++;
      }
    }

    // Commit only if we have updates
    if (ops > 0) {
      await batch.commit();
    }

    // Next page cursor
    lastDoc = snap.docs[snap.docs.length - 1];
  }

  console.log(`✅ Backfilled processed:false on ${totalUpdated} documents.`);
}

module.exports = { backfillMissingProcessedFlag };
