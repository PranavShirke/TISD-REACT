// firebase.js
import { initializeApp } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBXXJkXRYxZXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "aicare-xxxxx.firebaseapp.com",
  projectId: "aicare-xxxxx",
  storageBucket: "aicare-xxxxx.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
