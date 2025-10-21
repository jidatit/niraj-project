// utils/firestoreUtils.js
const {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
} = require("firebase/firestore");
const { db } = require("../firebase");

const getMatchingPersonnels = async (zipCode, type) => {
  const personnelsRef = collection(db, "Personnels");
  const q = query(
    personnelsRef,
    where("zipCodes", "array-contains", zipCode),
    where("type", "==", type),
    limit(3) // Limit to top 3 personnels
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const getEmailTemplate = async (type) => {
  const templateId =
    type === "AC Repair" ? "acPersonnelTemplate" : "roofPersonnelTemplate";
  const templateRef = doc(db, "emailTemplates", templateId);
  const templateDoc = await getDoc(templateRef);

  if (templateDoc.exists()) {
    return templateDoc.data();
  }

  // Fallback default templates
  const defaultTemplates = {
    "AC Repair": {
      subject: "AC Repair Contacts",
      body: "Dear Client,\n\nYour AC unit is approaching its expiration age. Here are our recommended AC repair personnel:\n\n{personnelDetails}\n\nBest regards,\nYour Company",
    },
    "Roof Repair": {
      subject: "Roof Maintenance Alert",
      body: "Dear Client,\n\nYour roof is nearing its expiration age. Here are our trusted roofing professionals:\n\n{personnelDetails}\n\nBest regards,\nYour Company",
    },
  };

  console.log(`No template found for ${type}. Using default.`);
  return defaultTemplates[type] || null;
};

module.exports = { getEmailTemplate, getMatchingPersonnels };
