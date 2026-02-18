import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-[#09090b] flex flex-col items-center justify-center px-5 py-8">
            <div className="w-full max-w-[380px]">
                {/* Logo */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">Vajra</h1>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1">Event Management System</p>
                </div>

                {/* Card */}
                <div className="bg-[#18181b] rounded-2xl border border-zinc-800 px-5 py-6 sm:px-7 sm:py-8 shadow-lg">
                    <h2 className="text-white text-base sm:text-lg font-semibold mb-0.5">Welcome back</h2>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-5 sm:mb-6">Sign in to your account</p>

                    {error && (
                        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs sm:text-sm text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-3.5 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-3.5 py-3 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-sm font-semibold py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[11px] text-zinc-600 mt-5 sm:mt-6">
                    Secured by Vajra
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
