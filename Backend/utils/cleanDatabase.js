const {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} = require("firebase/firestore");
const { db } = require("../firebase");

const collectionsToSearch = [
  "bound_policies",
  "home_quotes",
  "auto_quotes",
  "flood_quotes",
  "liability_quotes",
  "prep_quotes",
  "bind_req_quotes",
];

const fetchAndDeleteMatchingDocuments = async () => {
  try {
    for (const collectionName of collectionsToSearch) {
      console.log(`🔍 Searching in collection: ${collectionName}`);

      const collectionRef = collection(db, collectionName);

      const emailsToCheck = [
        "asdas",
        "zubairasada",
        "asdasd",
        "mnehaal2000@gmail.com",
        "asdas",
      ]; // Add more emails as needed

      const q = query(collectionRef, where("user.email", "in", emailsToCheck));

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`❌ No matching documents found in ${collectionName}.`);
      } else {
        console.log(
          `✅ Found ${snapshot.size} matching documents in ${collectionName}. Deleting...`
        );

        // // Delete each matching document
        for (const docSnapshot of snapshot.docs) {
          const docRef = doc(db, collectionName, docSnapshot.id);
          await deleteDoc(docRef);
          console.log(`🗑️ Deleted Document ID: ${docSnapshot.id}`);
        }

        console.log(
          `🚀 Successfully deleted ${snapshot.size} documents from ${collectionName}.\n`
        );
      }
    }
  } catch (error) {
    console.error("❗ Error fetching or deleting documents:", error);
  }
};

// Export the function
module.exports = fetchAndDeleteMatchingDocuments;
