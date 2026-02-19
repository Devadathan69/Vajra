
import * as XLSX from "xlsx";
import QRCode from "qrcode";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const generateQRs = async () => {
    try {
        const qrDir = join(process.cwd(), "member qr codes");
        if (!existsSync(qrDir)) {
            mkdirSync(qrDir);
        }

        console.log("Reading Vajra Registration.xlsx...");
        const fileBuffer = readFileSync(join(process.cwd(), "Vajra Registration.xlsx"));
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = rows[1]; // Header is at index 1 based on previous investigation
        const memberIdIndex = headers.indexOf("Member ID");
        const nameIndex = headers.indexOf("Member Name");

        if (memberIdIndex === -1 || nameIndex === -1) {
            console.error("Could not find 'Member ID' or 'Member Name' columns.");
            return;
        }

        console.log(`Found headers. Generating QR codes in '${qrDir}'...`);
        let count = 0;

        for (let i = 3; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const rawMemberId = row[memberIdIndex];
            const rawName = row[nameIndex];

            if (!rawMemberId || !rawName) continue;

            const memberId = String(rawMemberId).trim();
            const name = String(rawName).trim();

            // Data format: "Name MemberID" (e.g. "John Doe VT123")
            // Wait, the user said "encoded data" should be "Name and Member ID".
            // Typically for scanning, just the ID is better, but user asked for "Name and Member ID".
            // I'll stick to just the ID for the *data* if the scanner expects just ID, 
            // BUT the user explicitly said "with name and member id as the encoded data".
            // So I will encode: `${name} ${memberId}`
            // However, my scanner logic in Dashboard.tsx parses for `(VT[A-Z0-9]+)`. 
            // So `${name} ${memberId}` will work fine because the regex will extract the ID.

            const qrData = `${name} ${memberId}`;
            const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_"); // sanitize for filename
            const fileName = `${cleanName}-${memberId}.png`;
            const filePath = join(qrDir, fileName);

            await QRCode.toFile(filePath, qrData, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });

            count++;
            if (count % 50 === 0) process.stdout.write(".");
        }

        console.log(`\nSuccessfully generated ${count} QR codes.`);

    } catch (error) {
        console.error("Error generating QRs:", error);
    }
};

generateQRs();
