// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For Signup/Login [cite: 3]
import { getFirestore } from "firebase/firestore"; // For Database
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmv0HaRj8lbgF9e_bBjRbjrmlSHDrkGVY",
  authDomain: "sustainability-events-4d802.firebaseapp.com",
  projectId: "sustainability-events-4d802",
  storageBucket: "sustainability-events-4d802.firebasestorage.app",
  messagingSenderId: "356503802818",
  appId: "1:356503802818:web:91d881185ceedca39fbc5b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
