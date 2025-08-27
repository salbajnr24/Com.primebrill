import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: "AIzaSyBGO6RNnAtvVgp3tnHAWAQG9tnL1_ZS20o",
  authDomain: "brillprime-app-309ed.firebaseapp.com",
  databaseURL: "https://brillprime-app-309ed-default-rtdb.firebaseio.com",
  projectId: "brillprime-app-309ed",
  storageBucket: "brillprime-app-309ed.firebasestorage.app",
  messagingSenderId: "1096186932229",
  appId: "1:1096186932229:android:d8fd9e2ca40b1ce222406c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;