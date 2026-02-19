
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import QRScanner from './QRScanner';
import FoodEntry from './FoodEntry';
import { LogOut, Scan, Hexagon, Terminal, User, Loader2, Search, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'stats'>('scan');
    const [scannedId, setScannedId] = useState<string | null>(null);
    const [memberData, setMemberData] = useState<any>(null);
    const [manualId, setManualId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ total: 0, registered: 0, breakfast: 0, lunch: 0, dinner: 0 });
    const [allMembers, setAllMembers] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'stats') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "participants"));
            let total = 0, reg = 0, b = 0, l = 0, d = 0;
            const members: any[] = [];

            querySnapshot.forEach((doc) => {
                total++;
                const data = doc.data();
                if (data.registered) reg++;
                if (data.breakfast) b++;
                if (data.lunch) l++;
                if (data.dinner) d++;
                members.push({ id: doc.id, ...data });
            });

            // Sort: Registered first
            members.sort((a, b) => {
                if (a.registered === b.registered) return 0;
                return a.registered ? -1 : 1;
            });

            setStats({ total, registered: reg, breakfast: b, lunch: l, dinner: d });
            setAllMembers(members);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (scannedData: string) => {
        if (!scannedData) return;

        // Attempt to extract Member ID if data contains more text (e.g. "Name ID")
        const idMatch = scannedData.match(/\b(VT[A-Z0-9]+)\b/i);
        const id = idMatch ? idMatch[0] : scannedData.trim();

        setScannedId(id);
        setLoading(true);
        setError('');

        try {
            const docRef = doc(db, "participants", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setMemberData(docSnap.data());
            } else {
                setError(`Invalid Member ID: ${id}`);
                setMemberData(null);
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleScan(manualId);
    };

    const refreshData = () => {
        if (scannedId) handleScan(scannedId);
    };

    const clearScan = () => {
        setScannedId(null);
        setMemberData(null);
        setError('');
        setManualId('');
    };

    return (
        <div className="min-h-screen bg-black-bg relative overflow-hidden pb-24 font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-deep-purple/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[100px]" />
            </div>

            {/* Modern Glass Header */}
            <div className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(191,0,255,0.2)]">
                        <Hexagon size={20} className="text-white fill-neon-purple/50" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide text-white font-orbitron">VAJRA</h1>
                        <p className="text-[10px] text-neon-cyan font-mono tracking-widest uppercase opacity-80">Event Controller</p>
                    </div>
                </div>
                <button onClick={() => { signOut(auth); navigate('/'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
                    <LogOut size={20} />
                </button>
            </div>

            <div className="p-6 max-w-lg mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {scannedId && memberData ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <button onClick={clearScan} className="text-gray-400 hover:text-white text-xs font-bold font-mono flex items-center gap-2 transition-colors uppercase tracking-widest">
                                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-neon-cyan">←</div>
                                Return to Scanner
                            </button>
                            <div className="bg-[#13131a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Terminal size={120} className="text-white" />
                                </div>
                                {/* Glow Effect */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/20 blur-[60px]" />

                                <FoodEntry memberId={scannedId} data={memberData} onUpdate={refreshData} />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tabs"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl text-center backdrop-blur-md"
                                >
                                    <p className="font-medium text-sm">{error}</p>
                                    <button onClick={clearScan} className="mt-2 text-xs uppercase tracking-wider font-bold text-red-400 hover:text-white transition-colors border-b border-red-400/30 pb-0.5">Reset System</button>
                                </motion.div>
                            )}

                            {activeTab === 'scan' && (
                                <div className="space-y-8">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold font-orbitron tracking-wide text-white">
                                            Identity <span className="text-neon-cyan">Scan</span>
                                        </h2>
                                        <p className="text-gray-500 text-xs font-mono">ALIGN QR CODE WITHIN FRAME</p>
                                    </div>
                                    <QRScanner onScan={handleScan} onClose={() => { }} />
                                </div>
                            )}

                            {activeTab === 'search' && (
                                <div className="bg-[#13131a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
                                    {/* Decorative Blobs */}
                                    <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-neon-purple/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

                                    <h2 className="text-2xl font-bold mb-6 text-center font-orbitron tracking-wide">
                                        Manual <span className="text-neon-cyan">Override</span>
                                    </h2>

                                    <form onSubmit={handleManualSearch} className="space-y-6 relative z-10">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                                            <input
                                                type="text"
                                                value={manualId}
                                                onChange={(e) => setManualId(e.target.value)}
                                                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,247,255,0.15)] transition-all font-mono placeholder:text-gray-700"
                                                placeholder="ENTER ID (VT-XXX...)"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(0,170,255,0.3)] hover:shadow-[0_0_30px_rgba(0,170,255,0.4)] transition-all disabled:opacity-50 flex justify-center items-center gap-2 uppercase tracking-widest font-orbitron text-sm"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Search Database</>}
                                        </motion.button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'stats' && (
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-[#1a1a24] to-[#0d0d12] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-2xl group">
                                        <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold mb-2 font-orbitron">Total Registration</p>
                                        <div className="flex items-end gap-3">
                                            <p className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] font-orbitron">{loading ? '...' : stats.registered}</p>
                                            <p className="text-gray-500 font-mono mb-2">/ {stats.total}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <StatCard label="Breakfast" count={stats.breakfast} total={stats.registered} color="text-neon-cyan" loading={loading} idx={1} />
                                        <StatCard label="Lunch" count={stats.lunch} total={stats.registered} color="text-neon-purple" loading={loading} idx={2} />
                                        <StatCard label="Dinner" count={stats.dinner} total={stats.registered} color="text-[#ff00ff]" loading={loading} idx={3} />
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <h3 className="text-white font-orbitron text-lg flex items-center gap-2">
                                            Member Status
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400 font-mono">{allMembers.length}</span>
                                        </h3>
                                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {allMembers.map((member) => (
                                                <div key={member.id} className="bg-[#13131a]/60 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-[#13131a] transition-colors">
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{member.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">{member.id}</p>
                                                    </div>
                                                    {member.registered ? (
                                                        <span className="text-[10px] font-bold text-green-400 font-mono border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">REGISTERED</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-600 font-mono border border-white/5 bg-white/5 px-2 py-1 rounded">PENDING</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Modern Navbar */}
            {!scannedId && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#13131a]/90 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl z-50">
                    <TabButton active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} icon={Scan} label="SCAN" />
                    <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={Search} label="SEARCH" />
                    <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={BarChart3} label="STATS" />
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`px-5 py-3 rounded-full flex items-center gap-2 transition-all duration-300 relative overflow-hidden ${active ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
    >
        <div className="relative z-10 flex items-center gap-2">
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            {active && <span className="text-[10px] font-orbitron tracking-widest">{label}</span>}
        </div>
    </button>
);

const StatCard = ({ label, count, total, color, loading, idx }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="bg-[#13131a]/60 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-[#1a1a24] transition-colors group"
    >
        <div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-bold font-mono text-white group-hover:text-glow transition-all`}>{loading ? '...' : count}</p>
        </div>
        <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * (count / (total || 1)))} className={`${color} transition-all duration-1000 ease-out`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-gray-500 font-mono">{Math.round((count / (total || 1)) * 100)}%</span>
            </div>
        </div>
    </motion.div>
);

export default Dashboard;
