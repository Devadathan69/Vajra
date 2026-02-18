
import QRCode from 'qrcode';
import path from 'path';

const data = "Devadathan M R VT000M1";
const outputPath = path.join(process.cwd(), 'test_qr_devadathan.png');

QRCode.toFile(outputPath, data, {
    color: {
        dark: '#000000',  // Black dots
        light: '#ffffff'  // White background
    }
}, function (err) {
    if (err) throw err;
    console.log(`QR code generated at: ${outputPath}`);
});
