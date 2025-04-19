import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu94tawjUj9RaKkAfrzE1SZdL5M_s2TbY",
  authDomain: "aicarelink-41053.firebaseapp.com",
  projectId: "aicarelink-41053",
  storageBucket: "aicarelink-41053.firebasestorage.app",
  messagingSenderId: "637585840146",
  appId: "1:637585840146:web:fe81c8026d7a754126e0cb"
};

// Initialize Firebase
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
