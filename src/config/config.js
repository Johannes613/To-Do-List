import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB3p8k9p-weMjHFiXo2ue3_IVTbkyKiTk",
  authDomain: "fir-tut-17396.firebaseapp.com",
  projectId: "fir-tut-17396",
  storageBucket: "fir-tut-17396.firebasestorage.app",
  messagingSenderId: "723881723259",
  appId: "1:723881723259:web:29dd215c7add83ebaaa9de",
  measurementId: "G-CJV1Q7VGGY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

