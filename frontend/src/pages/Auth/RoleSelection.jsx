import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Car, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

const roles = [
    {
        id: 'restaurant',
        title: 'Restaurant',
        description: 'Donate excess food, track your impact, and receive AI-driven reduction insights.',
        icon: Utensils,
        color: 'bg-slate-50 text-slate-600',
    },
    {
        id: 'ngo',
        title: 'NGO',
        description: 'Claim donations, manage distribution routes, and coordinate volunteers efficiently.',
        icon: Heart,
        color: 'bg-slate-50 text-slate-600',
    },
    {
        id: 'volunteer',
        title: 'Volunteer',
        description: 'Sign up for delivery routes, track your trips, and view your personal contribution.',
        icon: Car,
        color: 'bg-slate-50 text-slate-600',
    },
    {
        id: 'admin',
        title: 'Administrator',
        description: 'Oversee network health, manage users, and access high-level analytics and reporting.',
        icon: Shield,
        color: 'bg-slate-50 text-slate-600',
    }
];

const RoleSelection = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans relative">
            {/* Top Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-10 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <span className="text-xl font-display font-bold text-slate-900 tracking-tight">EcoLink AI</span>
                </div>
                <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-16 max-w-7xl mx-auto w-full">
                <header className="mb-16 text-center max-w-2xl">
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-4 leading-tight">How will you use EcoLink?</h1>
                    <p className="text-sm text-slate-450 font-medium leading-relaxed">
                        Select your primary role to customize your dashboard and workflow. You can adjust this later in settings.
                    </p>
                </header>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[360px]"
                        >
                            <div>
                                <div className={`w-12 h-12 ${role.color} border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                                    <role.icon size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{role.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {role.description}
                                </p>
                            </div>
                            
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-[#4F7DF3] transition-colors mt-6 uppercase tracking-wider"
                            >
                                Continue <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <footer className="mt-20 text-center space-y-4">
                    <p className="text-xs font-medium text-slate-400">
                        Need help deciding? <button className="text-slate-900 underline underline-offset-4 hover:text-[#4F7DF3]">View role capabilities</button>
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        © 2024 EcoLink AI. Precision Food Recovery.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default RoleSelection;