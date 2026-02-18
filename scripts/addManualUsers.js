
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCc2svkf5m345wfsFz7tb5quH3gneUZB04",
    authDomain: "vajra-322a5.firebaseapp.com",
    projectId: "vajra-322a5",
    storageBucket: "vajra-322a5.firebasestorage.app",
    messagingSenderId: "1003730665327",
    appId: "1:1003730665327:web:2fbe467dd458f46fec329a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
    { id: "VT003M4", name: "Muzammil Ck" },
    { id: "VT000M1", name: "Devadathan M R" }
];

const addUsers = async () => {
    console.log("Starting manual user addition...");
    for (const user of users) {
        try {
            await setDoc(doc(db, "participants", user.id), {
                name: user.name,
                breakfast: false,
                lunch: false,
                dinner: false,
                createdAt: new Date()
            });
            console.log(`Successfully added: ${user.name} (${user.id})`);
        } catch (e) {
            console.error(`Error adding ${user.name}:`, e);
        }
    }
    console.log("Done.");
    process.exit();
};

addUsers();
