
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection, writeBatch } from "firebase/firestore";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import { join } from "path";

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

const KEEP_IDS = new Set(["VT000M1"]);

const run = async () => {
    try {
        // ── Step 1: Delete all participants except KEEP_IDS ──
        console.log("Step 1: Deleting existing participants (keeping VT000M1)...");
        const snapshot = await getDocs(collection(db, "participants"));
        let deleteCount = 0;

        for (const docSnap of snapshot.docs) {
            if (KEEP_IDS.has(docSnap.id)) {
                console.log(`  KEPT: ${docSnap.id}`);
                continue;
            }
            await deleteDoc(doc(db, "participants", docSnap.id));
            deleteCount++;
        }
        console.log(`Deleted ${deleteCount} participants.\n`);

        // ── Step 2: Seed from Excel ──
        console.log("Step 2: Seeding from Vajra Registration.xlsx...");
        const fileBuffer = readFileSync(join(process.cwd(), "Vajra Registration.xlsx"));
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = rows[1];
        const memberIdIndex = headers.indexOf("Member ID");
        const nameIndex = headers.indexOf("Member Name");

        if (memberIdIndex === -1 || nameIndex === -1) {
            console.error("Could not find 'Member ID' or 'Member Name' columns.");
            console.log("Headers found:", headers);
            process.exit(1);
        }

        const batchSize = 400;
        let batch = writeBatch(db);
        let count = 0;
        const addedMembers = new Set();

        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const rawMemberId = row[memberIdIndex];
            const name = row[nameIndex];
            if (!rawMemberId || !name) continue;

            const memberId = String(rawMemberId).trim();
            if (addedMembers.has(memberId)) continue;

            // Skip if it's a kept member (already in DB)
            if (KEEP_IDS.has(memberId)) {
                console.log(`  SKIPPED (already kept): ${memberId}`);
                continue;
            }

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
                console.log(`  Batch committed. Total so far: ${count}`);
                batch = writeBatch(db);
            }
        }

        if (count % batchSize !== 0) {
            await batch.commit();
        }

        console.log(`\nDone! Added ${count} new participants.`);
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

run();
