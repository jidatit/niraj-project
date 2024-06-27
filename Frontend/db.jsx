import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW7VXYV2g4ZM55oCcZjvKcqtCvWjJgxcc",
  authDomain: "niraj-project-ab004.firebaseapp.com",
  projectId: "niraj-project-ab004",
  storageBucket: "niraj-project-ab004.appspot.com",
  messagingSenderId: "558528427507",
  appId: "1:558528427507:web:37d0c0cab53b5e8b664e86"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);