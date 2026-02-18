
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCc2svkf5m345wfsFz7tb5quH3gneUZB04",
    authDomain: "vajra-322a5.firebaseapp.com",
    projectId: "vajra-322a5",
    storageBucket: "vajra-322a5.firebasestorage.app",
    messagingSenderId: "1003730665327",
    appId: "1:1003730665327:web:2fbe467dd458f46fec329a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
