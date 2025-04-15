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
    Email: "esbenmou325@gmail.com",
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
  try {
    if (!payload.Email || !payload.Carrier) return false;

    const q = query(
      collection(db, "bound_policies"),
      // where("carrier", "==", payload.Carrier),
      where("bound_status", "==", "bounded")
    );

    const querySnapshot = await getDocs(q);
    const searchEmail = payload.Email.toLowerCase();

    let hasMatch = false;
    querySnapshot.forEach((doc) => {
      const policy = doc.data();
      if (policy.user?.email?.toLowerCase() === searchEmail) {
        hasMatch = true;
      }
    });

    return hasMatch;
  } catch (error) {
    console.error("Policy check error:", error);
    return false;
  }
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

// runTests().catch((e) => console.error("Test failed:", e));
module.exports = { runTests, checkForActivePolicy };
