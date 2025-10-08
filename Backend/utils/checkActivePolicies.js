const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} = require("firebase/firestore");
const { db } = require("../firebase");

const testPayloads = [
  {
    Email: "crist_hs@hotmail.com",
    Carrier: "Neptune Flood",
    Name: "Greg Higham",
  },
  {
    Email: "ghigham@highmark.us.com",
    Carrier: "Non-Existent Carrier",
    Name: "Wrong Carrier",
  },
];
async function checkForActivePolicy(payload) {
  if (!payload.Email || !payload.Carrier) return false;

  // normalize exactly how you store it in Firestore!
  const emailToMatch = payload.Email.toLowerCase();

  // build a single query that only returns matching docs
  const q = query(
    collection(db, "bound_policies"),
    where("bound_status", "==", "bounded"),
    where("user.email", "==", emailToMatch)
  );

  const snap = await getDocs(q);
  // if any doc comes back, we know there’s an active policy
  return !snap.empty;
}

// ✅ Returns bound policy document if found, otherwise null
async function getBoundPolicy(payload) {
  if (!payload.Email) return null;

  const emailToMatch = payload.Email.toLowerCase();

  const q = query(
    collection(db, "bound_policies"),
    where("bound_status", "==", "bounded"),
    where("user.email", "==", emailToMatch),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const boundDoc = snap.docs[0];
  return { id: boundDoc.id, data: boundDoc.data() };
}

async function runTests() {
  console.log("Running policy checks...");

  for (const payload of testPayloads) {
    const result = await checkForActivePolicy(payload);
    console.log(
      `[${payload.Name}] ${payload.Carrier} | ` +
        `Status: ${result ? "RENEWAL" : "NEW QUOTE"}`
    );
  }

  console.log("Tests completed");
}

module.exports = { runTests, checkForActivePolicy, getBoundPolicy };
