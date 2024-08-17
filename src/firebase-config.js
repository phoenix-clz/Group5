import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVZmbJEZ39b11XgtvGTiHXP77zBGk8i0Q",
  authDomain: "smart-paisa-56aa4.firebaseapp.com",
  projectId: "smart-paisa-56aa4",
  storageBucket: "smart-paisa-56aa4.appspot.com",
  messagingSenderId: "986106966034",
  appId: "1:986106966034:web:c2fef79579bdd056f628cb"
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
