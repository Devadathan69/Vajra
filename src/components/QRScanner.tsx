
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, Image as ImageIcon } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { useRef } from 'react';
import { motion } from 'framer-motion';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await QrScanner.scanImage(file);
            if (result) {
                onScan(result);
            }
        } catch (error) {
            console.error("QR Scan Error:", error);
            alert("Could not read QR code from image.");
        }
    };

    return (
        <div className="relative w-full aspect-square max-w-sm mx-auto overflow-hidden rounded-[2.5rem] border-4 border-[#13131a] shadow-2xl bg-black group ring-1 ring-white/10">
            <Scanner
                onScan={(result) => {
                    if (result && result.length > 0) {
                        onScan(result[0].rawValue);
                    }
                }}
                components={{
                    audio: false,
                    onOff: true,
                    torch: true,
                }}
                styles={{
                    container: { width: '100%', height: '100%' },
                    video: { width: '100%', height: '100%', objectFit: 'cover' }
                }}
            />

            {/* Minimalist Tech Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="w-full h-full relative p-8">
                    {/* Corners */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-xl" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/50 rounded-tr-xl" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/50 rounded-bl-xl" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/50 rounded-br-xl" />

                    {/* Scanning Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-line opacity-50" />

                    {/* Tag */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        <span className="text-[10px] font-orbitron tracking-widest text-white/80">SCANNING...</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:bg-black/80 hover:text-white transition-all z-50 pointer-events-auto border border-white/5"
            >
                <X size={20} />
            </button>

            {/* Upload Button */}
            <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white text-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all"
                >
                    <ImageIcon size={20} />
                </motion.button>
            </div>
        </div>
    );
};

export default QRScanner;
