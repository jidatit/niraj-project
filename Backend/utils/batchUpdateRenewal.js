const {
  collection,
  getDocs,
  query,
  where,
  limit,
  writeBatch,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");

async function batchUpdateRenewalPolicyLink() {
  console.log("🚀 Starting batch update for renewal_quotes...");

  try {
    // 1️⃣ Fetch all renewal quotes
    const renewalSnap = await getDocs(collection(db, "renewal_quotes"));
    console.log(`Found ${renewalSnap.size} renewal quotes`);

    // 2️⃣ Group by email
    const emailMap = new Map();
    renewalSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const email = data.Email?.toLowerCase();
      if (!email) return;
      if (!emailMap.has(email)) emailMap.set(email, []);
      emailMap.get(email).push({ id: docSnap.id, data });
    });

    console.log(`Grouped into ${emailMap.size} unique emails`);

    // 3️⃣ Loop through each email and update matching docs
    let matchedCount = 0;
    let unmatchedCount = 0;
    let updatedDocsCount = 0;

    for (const [email, docs] of emailMap.entries()) {
      const boundQ = query(
        collection(db, "bound_policies"),
        where("user.email", "==", email),
        where("bound_status", "==", "bounded"),
        limit(1)
      );

      const boundSnap = await getDocs(boundQ);

      if (!boundSnap.empty) {
        matchedCount++;
        const boundDoc = boundSnap.docs[0];
        const boundData = boundDoc.data();

        const updateData = {
          boundPolicyId: boundDoc.id,
          boundPolicyCarrier: boundData.Carrier || boundData.carrier || "",
          boundPolicyEffectiveDate: boundData.effective_date || "",
        };

        console.log(`✅ Updating ${docs.length} renewal docs for ${email}`);

        const batch = writeBatch(db);
        docs.forEach((d) => {
          const ref = doc(db, "renewal_quotes", d.id);
          batch.update(ref, updateData);
        });

        await batch.commit();
        updatedDocsCount += docs.length;
      } else {
        unmatchedCount++;
        console.log(`⚠️ No bound policy found for ${email}`);
      }
    }

    console.log(`
✅ Batch Update Complete:
Matched Emails: ${matchedCount}
Unmatched Emails: ${unmatchedCount}
Total Emails Checked: ${emailMap.size}
Total Docs Updated: ${updatedDocsCount}
`);
  } catch (error) {
    console.error("❌ Error during batch update:", error);
  }
}

// Run immediately if called directly
if (require.main === module) {
  batchUpdateRenewalPolicyLink().catch(console.error);
}

module.exports = { batchUpdateRenewalPolicyLink };
