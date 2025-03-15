// utils/firestoreUtils.js
const {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");

const getMatchingPersonnels = async (zipCode, type) => {
  const personnelsRef = collection(db, "Personnels");
  const q = query(
    personnelsRef,
    where("zipCodes", "array-contains", zipCode),
    where("type", "==", type)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
const getEmailTemplate = async () => {
  const templateRef = doc(db, "emailTemplates", "personnelTemplate");
  const templateDoc = await getDoc(templateRef);
  return templateDoc.exists() ? templateDoc.data() : null;
};

module.exports = { getEmailTemplate, getMatchingPersonnels };
