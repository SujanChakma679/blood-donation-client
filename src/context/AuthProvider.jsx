import React, { useEffect, useState} from "react";

import {
  createUserWithEmailAndPassword,
  
  GoogleAuthProvider,
  
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    //   console.log(currentUser)
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
  if (!user?.email) return; 
  axios.get(`http://localhost:5000/users/role/${user.email}`)
    .then(res => {
      setRole(res.data.role);
    })
    .catch(err => {
      console.error("Error fetching user role:", err);
    });
    
}, [user]); // Re-runs whenever the user object changes

  console.log(role)

  const authInfo = {
    setUser,
    createUser,
    signInUser,
    signInWithGoogle,
    logOutUser,
    user,
    loading,
    role
  };
  return <AuthContext value={authInfo}>{children}
            </AuthContext>;
};

export default AuthProvider;
