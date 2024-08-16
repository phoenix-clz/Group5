import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3iTmyao5kY021eTRPhX-qeJcl6rNZ-Zk",
  authDomain: "smartmoney-a17cd.firebaseapp.com",
  projectId: "smartmoney-a17cd",
  storageBucket: "smartmoney-a17cd.appspot.com",
  messagingSenderId: "551295988975",
  appId: "1:551295988975:web:39d16215f30cfcc233d71a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set up a persistent authentication listener
const setAuthPersistence = async () => {
  await auth.setPersistence(auth.Auth.Persistence.LOCAL);
};

const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged((user) => {
    callback(user);
  });
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user; // Return user data for further use
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return null; // Return null if there's an error
  }
};

// Function to handle Sign Out
const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Export the auth persistence function
export {
  auth,
  signInWithGoogle,
  logout,
  db,
  setAuthPersistence,
  onAuthStateChanged,
};
