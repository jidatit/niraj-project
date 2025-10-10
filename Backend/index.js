const express = require("express");
const app = express();
const CORS = require("cors");
const config = require("./config.js");
const PORT = config.port || 10000;
const HOSTURL = config.hostUrl;
const {
  getDocs,
  addDoc,
  collection,
  query,
  where,
} = require("firebase/firestore");
const { db } = require("./firebase.js");
const fetch = require("node-fetch");
const {
  checkForActivePolicy,
  getBoundPolicy,
  runTests,
} = require("./utils/checkActivePolicies.js");
//Quote Rush Routes
const quoterushRouter = require("./quoterush");
require("./cronJobs");

app.use(CORS());
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    let payload = req.body;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] Received webhook payload`);

    // Normalize email
    if (payload.Email) {
      payload.Email = payload.Email.toLowerCase();
    }

    console.log(`Payload is ${JSON.stringify(payload)}`);

    // Check for active policy (and return the policy doc if found)
    const boundPolicy = await getBoundPolicy(payload);

    // Determine collection name
    const collectionName = boundPolicy ? "renewal_quotes" : "cms_quotes";

    // Add metadata
    payload.receivedAt = timestamp;
    payload.isRenewal = !!boundPolicy;
    payload.processed = false;

    // If renewal, attach bound policy info directly
    if (boundPolicy) {
      payload.boundPolicyId = boundPolicy.id;
      payload.boundPolicyCarrier =
        boundPolicy.data.Carrier || boundPolicy.data.carrier || "";
      payload.boundPolicyEffectiveDate = boundPolicy.data.effective_date || "";
    }

    // Store payload
    await addDoc(collection(db, collectionName), payload);

    console.log(`Stored in ${collectionName} collection`);

    res.status(201).json({
      message: `Quote stored as ${boundPolicy ? "renewal" : "new"} quote`,
      status: "201",
      isRenewal: !!boundPolicy,
      payload,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});
app.post("/renewal", async (req, res) => {
  try {
    console.log("renewal request comes");
    let payload = req.body;
    console.log("payload", payload);
    const timestamp = new Date().toISOString();
    console.log("New Record:");
    console.log(`[${timestamp}] Received webhook payload`);
    if (payload.Email) {
      payload.Email = payload.Email.toLowerCase();
    }
    // await addDoc(collection(db, "cms_quotes"), payload);
    res.status(201).json({
      message: "Quotes receieved quickly!",
      status: "201",
      payload,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.get("/get_quotes", async (req, res) => {
  try {
    const { email, zipCode } = req.query;
    if (email && zipCode) {
      const quotesList = [];

      const CmsQuotesRef = collection(db, "cms_quotes");
      const queryResults = query(
        CmsQuotesRef,
        where("Email", "==", email.toLowerCase()),
        where("zipCode", "==", zipCode)
      );

      const querySnapshot = await getDocs(queryResults);

      if (querySnapshot.empty) {
        res.status(200).json({
          success: false,
          status: 404,
          message: `No Quotes from Client Dynamics Found for email: ${email} and zipCode: ${zipCode}`,
        });
      } else {
        querySnapshot.forEach((doc) => {
          const quoteData = {
            id: doc.id,
            ...doc.data(),
          };
          quotesList.push(quoteData);
        });

        res.status(200).json({ success: true, status: 200, quotesList });
      }
    } else {
      res.status(200).json({
        success: false,
        status: 401,
        message: `Email and zipCode are required.`,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/contact_info", async (req, res) => {
  try {
    const { email } = req.body;

    const response = await fetch(
      `https://jgi-holdings.clientdynamics.com/api/Contacts/list?search_criteria=email&search_value=${email.toLowerCase()}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": "8ee0c18932f2b248f9ef43879ee54b665d82409b",
          "X-Agency-Id": "7447270375",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const ContactId = data.results[0]?.ContactId || null;
    const address = data.results[0]?.address || null;

    if (ContactId !== null) {
      res
        .status(200)
        .json({ status: 200, address: address, ContactId: ContactId });
    } else {
      res.status(200).json({ status: 400, message: "No ContactId found." });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/policy_info", async (req, res) => {
  try {
    const { ContactId } = req.body;

    const response = await fetch(
      `https://jgi-holdings.clientdynamics.com/api/Policies/list?search_criteria=ContactId&search_value=${ContactId}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": "8ee0c18932f2b248f9ef43879ee54b665d82409b",
          "X-Agency-Id": "7447270375",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.num_records === 0) {
      res.status(200).json({
        status: 400,
        message: "No Policy Data Found.",
        policyData: null,
      });
    } else {
      res.status(200).json({ status: 200, policyData: data.results });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: error.message });
  }
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

app.use("/api/quoterush", quoterushRouter);

// Run tests
// runTests().catch((error) => {
//   console.error("Test execution failed:", error);
//   process.exit(1);
// });
app.listen(PORT, () => {
  console.log(`Server is live @ ${HOSTURL}`);
});
