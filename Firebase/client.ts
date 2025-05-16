
// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjd2XABhWWICs8yzNOmmucVkNxt3IxLlc",
  authDomain: "ai-mockinterview-92fa3.firebaseapp.com",
  projectId: "ai-mockinterview-92fa3",
  storageBucket: "ai-mockinterview-92fa3.firebasestorage.app",
  messagingSenderId: "673973703558",
  appId: "1:673973703558:web:dd74162db2d05853895207",
  measurementId: "G-EX58SW5VK3"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app)
export const db = getFirestore(app)