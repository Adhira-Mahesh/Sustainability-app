// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For Signup/Login [cite: 3]
import { getFirestore } from "firebase/firestore"; // For Database
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: " ",
  authDomain: "",
  projectId: "",
  storageBucket: " ",
  messagingSenderId: "",
  appId: " "
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
