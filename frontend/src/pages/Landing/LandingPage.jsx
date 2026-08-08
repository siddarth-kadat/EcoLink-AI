import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Settings, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen bg-white overflow-hidden font-sans">
            {/* Background Gradient Blurs */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-100 rounded-full blur-[120px]" />
            </div>

            {/* Navigation Header */}
            <nav className="relative z-10 flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">EcoLink AI</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Home', 'Features', 'Technology', 'About'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-slate-900 px-4 py-2 hover:text-slate-600 transition-colors">Login</Link>
                    <Link to="/role-selection" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-xs">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 pt-20 pb-32 px-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Column Text */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold mb-8 uppercase tracking-wider"
                        >
                            <div className="w-1.5 h-1.5 bg-[#4F7DF3] rounded-full animate-pulse" />
                            Now powering food recovery in 50+ cities
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.15] mb-8"
                        >
                            Rescuing Surplus <br />
                            Food with <span className="text-[#4F7DF3]">AI</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-medium"
                        >
                            Intelligently matching surplus food with the most suitable NGO before it expires using explainable AI. Precision logistics for a zero-waste future.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4"
                        >
                            <Link to="/role-selection" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-sm flex items-center gap-2 shadow-xl shadow-slate-900/10">
                                Get Started <ArrowRight size={16} />
                            </Link>
                            <button className="px-8 py-4 border border-slate-200 text-slate-800 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Play size={12} fill="currentColor" /></div> Watch Demo
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column Grid of Floating Cards */}
                    <div className="flex-1 relative w-full max-w-lg">
                        <div className="grid grid-cols-2 gap-6 items-end">
                            {/* Card 1: 85% Waste Reduction */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex flex-col justify-between h-56"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-extrabold text-slate-900">85%</h3>
                                    <p className="text-xs text-slate-450 font-bold uppercase tracking-wider mt-1">Waste Reduction</p>
                                </div>
                            </motion.div>

                            {/* Card 2: Dark Navy EcoMatch AI */}
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-[#0B1026] p-8 rounded-[32px] text-white flex flex-col justify-between h-56 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                                    <Settings size={20} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold">EcoMatch AI</h3>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">Real-time routing</p>
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-[#4F7DF3]/15 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                            </motion.div>

                            {/* Card 3: Live Recovery Banner (Span 2) */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Recovery</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 bg-[#4F7DF3] rounded-full" /> 124 lbs rescued in SF
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={20} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Trust Banner Section */}
            <section className="relative z-10 py-16 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-10">
                        Trusted by innovative organizations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-35 grayscale text-sm font-bold tracking-widest text-slate-900">
                        <div>CITY HARVEST</div>
                        <div>FEEDING AMERICA</div>
                        <div>WASTE NO MORE</div>
                        <div>GLOBAL FOODS</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-100 py-12 px-10 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-sm font-bold text-slate-900">EcoLink AI</span>
                    <div className="flex gap-8 text-xs font-semibold text-slate-400">
                        {['Privacy', 'Terms', 'Security', 'Status'].map(link => (
                            <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-slate-900 transition-colors">{link}</a>
                        ))}
                    </div>
                    <span className="text-xs text-slate-450 font-medium">© 2024 EcoLink AI. Precision Food Recovery.</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;