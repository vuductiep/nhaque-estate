// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nhaque-estate.firebaseapp.com",
  projectId: "nhaque-estate",
  storageBucket: "nhaque-estate.appspot.com",
  messagingSenderId: "764226586307",
  appId: "1:764226586307:web:180a3a6f1e7f5fd6240476"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);