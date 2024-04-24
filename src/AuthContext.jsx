import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../db';
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signupType, setsignupType] = useState("");

  const getUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData;
      } else {
        const adminDocRef = doc(db, "admins", userId);
        const adminDocSnapshot = await getDoc(adminDocRef);
        if (adminDocSnapshot.exists()) {
          const adminData = adminDocSnapshot.data()
          return adminData;
        }
        else {
          console.log("No user/admin exists.")
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setCurrentUser(user)
      setLoading(false);
      if (user) {
        const data = await getUserDetails(user.uid)
        setsignupType(data.signupType)
        let allDetails = { ...user, data }
        setCurrentUser(allDetails)
        localStorage.setItem('currentUser', JSON.stringify(allDetails));
        localStorage.setItem('signupType', JSON.stringify(data.signupType));
      } else {
        localStorage.removeItem('currentUser');
      }
    });

    const storedUser = localStorage.getItem('currentUser');
    const signupT = localStorage.getItem('signupType');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setsignupType(JSON.parse(signupT))
      setLoading(false);
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('signupType');
      setCurrentUser(null)
      setsignupType(null)
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, signupType }}>
      {children}
    </AuthContext.Provider>
  );
};
