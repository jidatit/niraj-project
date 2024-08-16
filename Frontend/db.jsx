import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Ot4n9CLzQpRcfNo34HN2IiTDf4A-gl8",
  authDomain: "niraj-project-b09c8.firebaseapp.com",
  projectId: "niraj-project-b09c8",
  storageBucket: "niraj-project-b09c8.appspot.com",
  messagingSenderId: "87355456997",
  appId: "1:87355456997:web:6aae5b8351635675eb030c",
  measurementId: "G-QJ3HHDKSZJ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);