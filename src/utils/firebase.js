// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy1H_QHxKjUmTtDdP1n5u-6qX148O63OI",
  authDomain: "anime-gpt.firebaseapp.com",
  projectId: "anime-gpt",
  storageBucket: "anime-gpt.firebasestorage.app",
  messagingSenderId: "669609966381",
  appId: "1:669609966381:web:67d4713c194088d03ef1a4",
  measurementId: "G-GMW9YS19NZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);