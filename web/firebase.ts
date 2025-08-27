
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArFKtRINXm4jze9wh4A5RhFmRFV8HH7ZE",
  authDomain: "brillprime-app-309ed.firebaseapp.com",
  databaseURL: "https://brillprime-app-309ed-default-rtdb.firebaseio.com",
  projectId: "brillprime-app-309ed",
  storageBucket: "brillprime-app-309ed.firebasestorage.app",
  messagingSenderId: "1096186932229",
  appId: "1:1096186932229:web:046a765e077ebbcc22406c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
