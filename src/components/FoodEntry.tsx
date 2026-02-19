
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Check, Loader2, Utensils, Coffee, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodEntryProps {
    memberId: string;
    data: {
        name: string;
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
        registered?: boolean;
    };
    onUpdate: () => void;
}

const FoodEntry = ({ memberId, data, onUpdate }: FoodEntryProps) => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleCheck = async (meal: 'breakfast' | 'lunch' | 'dinner') => {
        if (!data.registered || data[meal]) return;

        setLoading(meal);
        try {
            const docRef = doc(db, 'participants', memberId);
            await updateDoc(docRef, {
                [meal]: true
            });
            onUpdate();
        } catch (error) {
            console.error("Error updating meal:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleRegistration = async () => {
        setLoading('registration');
        try {
            const docRef = doc(db, 'participants', memberId);
            await updateDoc(docRef, {
                registered: !data.registered
            });
            onUpdate();
        } catch (error) {
            console.error("Error updating registration:", error);
        } finally {
            setLoading(null);
        }
    };

    const meals = [
        { id: 'breakfast', label: 'Breakfast', icon: Coffee, time: '08:00 - 10:00', gradient: 'from-orange-400 to-red-500' },
        { id: 'lunch', label: 'Lunch', icon: Utensils, time: '13:00 - 14:30', gradient: 'from-blue-400 to-neon-cyan' },
        { id: 'dinner', label: 'Dinner', icon: Moon, time: '20:00 - 21:30', gradient: 'from-neon-purple to-[#ff00ff]' },
    ];

    return (
        <div className="w-full relative">
            <div className="flex items-center justify-between gap-5 mb-8">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <User size={28} className="text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white font-orbitron uppercase tracking-wide mb-1">{data.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-neon-cyan tracking-widest">{memberId}</span>
                            {data.registered && <span className="text-[10px] text-green-400 font-mono tracking-wider font-bold">REGISTERED</span>}
                        </div>
                    </div>
                </div>

                {/* Registration Toggle */}
                <button
                    onClick={handleRegistration}
                    disabled={loading === 'registration'}
                    className={`
                        px-4 py-2 rounded-xl text-xs font-bold font-orbitron tracking-wider transition-all border
                        ${data.registered
                            ? 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 hover:text-neon-cyan'}
                    `}
                >
                    {loading === 'registration' ? <Loader2 className="animate-spin" size={16} /> : (data.registered ? 'UNMARK' : 'MARK REGISTERED')}
                </button>
            </div>

            <div className="space-y-4">
                {meals.map((meal, index) => {
                    const isTaken = data[meal.id as keyof typeof data] as boolean;
                    const isLoading = loading === meal.id;
                    const Icon = meal.icon;

                    return (
                        <motion.button
                            key={meal.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={!isTaken ? { scale: 1.02 } : {}}
                            whileTap={!isTaken ? { scale: 0.98 } : {}}
                            onClick={() => handleCheck(meal.id as any)}
                            disabled={!data.registered || isTaken || isLoading}
                            className={`
                relative w-full p-1 rounded-2xl transition-all duration-300
                ${(!data.registered || isTaken)
                                    ? 'opacity-60 saturate-0 cursor-not-allowed'
                                    : 'hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}
              `}
                        >
                            {/* Gradient Border Background */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${meal.gradient} opacity-20 ${(!data.registered || isTaken) ? '' : 'group-hover:opacity-40'} transition-opacity`} />

                            <div className={`
                    relative bg-[#13131a] rounded-xl p-4 flex items-center justify-between border border-white/5
                    ${(!data.registered || isTaken) ? '' : 'hover:bg-[#1a1a24] transition-colors'}
                `}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-black/50 text-gray-400 ${!isTaken && 'group-hover:text-white'} transition-colors`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-white font-orbitron text-sm">{meal.label}</h3>
                                        <p className="text-[10px] text-gray-500 font-mono">{meal.time}</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    {isLoading ? (
                                        <Loader2 className="animate-spin text-white" size={20} />
                                    ) : (
                                        <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                ${isTaken
                                                ? `bg-gradient-to-r ${meal.gradient} shadow-[0_0_10px_rgba(255,255,255,0.3)]`
                                                : 'bg-white/5 border border-white/10 group-hover:bg-white/10'}
                            `}>
                                            {isTaken && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default FoodEntry;
