// utils/firestoreUtils.js
const { collection, query, getDocs } = require("firebase/firestore");
const { db } = require("../firebase");

const getPolicies = async () => {
  const boundPoliciesRef = collection(db, "bound_policies");
  const snapshot = await getDocs(boundPoliciesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = { getPolicies };
