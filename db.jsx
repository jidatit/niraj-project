import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB8sj5mXIRYtpo9j72hMjZyax2R5K7OZ8",
  authDomain: "niraj-a1ec7.firebaseapp.com",
  projectId: "niraj-a1ec7",
  storageBucket: "niraj-a1ec7.appspot.com",
  messagingSenderId: "457004900631",
  appId: "1:457004900631:web:0083e1d210194861569752"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
export const analytics = getAnalytics(app);