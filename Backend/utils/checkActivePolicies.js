const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
} = require("firebase/firestore");
const { db } = require("../firebase");

const testPayloads = [
  {
    Email: "client@client.com",
    zipCode: "48000",
    Carrier: "test",
    Name: "Client (Match zipCode)",
  },
  {
    Email: "client@client.com",
    zipCode: "21312",
    Carrier: "test",
    Name: "Client (Match user.zipCode)",
  },
  {
    Email: "client@client.com",
    zipCode: "99999",
    Carrier: "test",
    Name: "Client (Non-matching zipCode)",
  },
  {
    Email: "client@client.com",
    zipCode: "",
    Carrier: "test",
    Name: "Client (Empty zipCode)",
  },
  {
    Email: "",
    zipCode: "48000",
    Carrier: "test",
    Name: "No Email",
  },
];

// getBoundPolicy function with minimal debug logging
async function getBoundPolicy(payload) {
  console.log(
    `[DEBUG] Processing payload: Email=${payload.Email}, Zip=${payload.zipCode}`
  );

  if (!payload.Email || !payload.zipCode) {
    return null;
  }

  const emailToMatch = payload.Email.toLowerCase();
  let zipCodeToMatch = payload.zipCode.toString().trim();

  // First attempt: Match by email and bound_policies.zipCode
  let q = query(
    collection(db, "bound_policies"),
    where("bound_status", "==", "bounded"),
    where("user.email", "==", emailToMatch),
    where("zipCode", "==", zipCodeToMatch),
    limit(1)
  );

  let snap;
  try {
    snap = await getDocs(q);
    if (!snap.empty) {
      console.log(
        `[DEBUG] Email and zipCode matched with payload: Email=${payload.Email}, Zip=${payload.zipCode}`
      );
      const boundDoc = snap.docs[0];
      return { id: boundDoc.id, data: boundDoc.data() };
    }
  } catch (error) {
    console.error(`[DEBUG] Primary query error:`, error.message);
  }

  // Fallback: Match by email and user.zipCode
  q = query(
    collection(db, "bound_policies"),
    where("bound_status", "==", "bounded"),
    where("user.email", "==", emailToMatch),
    where("user.zipCode", "==", zipCodeToMatch),
    limit(1)
  );

  try {
    snap = await getDocs(q);
    if (!snap.empty) {
      console.log(
        `[DEBUG] Email and user.zipCode matched with payload: Email=${payload.Email}, Zip=${payload.zipCode}`
      );
      const boundDoc = snap.docs[0];
      return { id: boundDoc.id, data: boundDoc.data() };
    }
  } catch (error) {
    console.error(`[DEBUG] Fallback query error:`, error.message);
  }

  return null;
}

// Test function
async function runTests() {
  console.log("Starting getBoundPolicy tests using real bound_policies...");

  // Run tests for getBoundPolicy
  for (const payload of testPayloads) {
    const result = await getBoundPolicy(payload);
    console.log(
      `[${payload.Name}] Email: ${payload.Email}, Zip: ${payload.zipCode} | ` +
        `Result: ${
          result ? `Found policy (ID: ${result.id})` : "No policy found"
        }`
    );
    if (result) {
      console.log(`  Policy Details:`, {
        carrier: result.data.carrier,
        zipCode: result.data.zipCode,
        userZipCode: result.data.user.zipCode,
        email: result.data.user.email,
      });
    }
  }

  console.log("\nTests completed");
}

module.exports = { runTests, getBoundPolicy };
