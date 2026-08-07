import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Heart, BarChart3, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            {/* Background Shader Placeholder / Animated Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-soft rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-10 py-6 max-w-container-max mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">EcoLink AI</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'How It Works', 'Technology', 'About'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-semibold text-slate-900 px-4 py-2">Login</Link>
                    <Link to="/role-selection" className="btn-primary shadow-lg shadow-primary/20">
                        Get Started <ArrowRight size={18} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 pt-20 pb-32 px-10 max-w-container-max mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-soft text-primary rounded-full text-xs font-bold mb-6"
                        >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            NOW POWERING FOOD RECOVERY IN 50+ CITIES
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-8"
                        >
                            Rescuing Surplus <br />
                            <span className="text-primary italic">Food with AI</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-500 max-w-xl mb-10 leading-relaxed"
                        >
                            EcoLink AI intelligently matches surplus food with the most suitable NGO before it expires using explainable AI and intelligent decision support.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4"
                        >
                            <Link to="/role-selection" className="btn-primary px-8 py-4 text-lg">
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <button className="btn-secondary px-8 py-4 text-lg bg-white/50 backdrop-blur-sm">
                                Watch Demo <Play size={20} fill="currentColor" />
                            </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1 relative"
                    >
                        <div className="bg-white/40 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-2xl relative z-10">
                            {/* Mock AI Card UI */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                                        <Sparkles className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">EcoMatch AI</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Intelligence</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">98% Match</div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                                <div className="h-20 bg-primary-soft/30 border border-primary/10 rounded-2xl flex items-center justify-center">
                                    <BarChart3 className="text-primary opacity-30" size={32} />
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </header>

            {/* Trust Section */}
            <section className="relative z-10 py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-container-max mx-auto px-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-12">
                        Trusted by innovative organizations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale">
                        <div className="text-2xl font-bold text-slate-900">CITY HARVEST</div>
                        <div className="text-2xl font-bold text-slate-900">FEEDING AMERICA</div>
                        <div className="text-2xl font-bold text-slate-900">WASTE NO MORE</div>
                        <div className="text-2xl font-bold text-slate-900">GLOBAL FOODS</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;