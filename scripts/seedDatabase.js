
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import { join } from "path";

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
const db = getFirestore(app);

const seedDatabase = async () => {
    try {
        const fileBuffer = readFileSync(join(process.cwd(), "Vajra Registration.xlsx"));
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Headers are on row 1 (0-indexed logic in code might differ, but based on inspection:
        // Row 0: Title
        // Row 1: Headers (Team ID, Team Name, Member ID, etc.)
        // Data starts at Row 3

        const data = XLSX.utils.sheet_to_json(sheet, { range: 2 }); // range: 2 means start at row index 2 (Row 3)
        // Wait, sheet_to_json with range takes header from that row?
        // If we say range: 1, it takes headers from Row 2.
        // The headers are at Row 1 (index 1).
        // The data is at Row 3 (index 3).
        // There is an empty row at index 2.

        // Better approach: convert to array of arrays
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // rows[1] is header: ['Team ID', ..., 'Member ID', 'Member Name', ...]

        const headers = rows[1];
        const memberIdIndex = headers.indexOf("Member ID");
        const nameIndex = headers.indexOf("Member Name"); // Check exact text from previous output

        if (memberIdIndex === -1 || nameIndex === -1) {
            console.error("Could not find 'Member ID' or 'Member Name' columns.");
            console.log("Headers found:", headers);
            return;
        }

        console.log(`Found headers at index 1. Member ID: ${memberIdIndex}, Name: ${nameIndex}`);

        const batchSize = 400; // Firestore batch limit is 500
        let batch = writeBatch(db);
        let count = 0;

        // stored member IDs to prevent duplicates
        const addedMembers = new Set();

        // Data starts at index 3
        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const rawMemberId = row[memberIdIndex];
            const name = row[nameIndex];

            if (!rawMemberId) continue;

            const memberId = String(rawMemberId).trim();

            if (addedMembers.has(memberId)) continue;

            const docRef = doc(db, "participants", memberId);
            batch.set(docRef, {
                name: String(name).trim(),
                breakfast: false,
                lunch: false,
                dinner: false,
                createdAt: new Date()
            });

            addedMembers.add(memberId);
            count++;

            if (count % batchSize === 0) {
                await batch.commit();
                console.log(`Batch committed. Total so far: ${count}`);
                batch = writeBatch(db);
            }
        }

        if (count % batchSize !== 0) {
            await batch.commit();
        }

        console.log(`Seeding complete. Added ${count} participants.`);

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

seedDatabase();
