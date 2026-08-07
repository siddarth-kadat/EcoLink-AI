import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Car, ShieldCheck, ArrowRight } from 'lucide-react';

const roles = [
    {
        id: 'restaurant',
        title: 'Restaurant',
        description: 'Donate excess food, track your impact, and receive AI-driven reduction insights.',
        icon: Utensils,
        color: 'bg-orange-50 text-orange-600',
    },
    {
        id: 'ngo',
        title: 'NGO',
        description: 'Claim donations, manage distribution routes, and coordinate volunteers efficiently.',
        icon: Heart,
        color: 'bg-rose-50 text-rose-600',
    },
    {
        id: 'volunteer',
        title: 'Volunteer',
        description: 'Sign up for delivery routes, track your trips, and view your personal contribution.',
        icon: Car,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        id: 'admin',
        title: 'Administrator',
        description: 'Oversee network health, manage users, and access high-level analytics and reporting.',
        icon: ShieldCheck,
        color: 'bg-emerald-50 text-emerald-600',
    }
];

const RoleSelection = () => {
    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-10">
            <header className="mb-16 text-center">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white rounded-full" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">EcoLink AI</span>
                </div>
                <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">How will you use EcoLink?</h1>
                <p className="text-slate-500 max-w-lg">Select your primary role to customize your dashboard and workflow. You can adjust this later in settings.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className={`w-14 h-14 ${role.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <role.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{role.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-10 min-h-[60px]">
                            {role.description}
                        </p>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-primary transition-colors"
                        >
                            Continue <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                ))}
            </div>

            <footer className="mt-20 text-center">
                <p className="text-xs font-medium text-slate-400">
                    Need help deciding? <button className="text-slate-900 underline underline-offset-4">View role capabilities</button>
                </p>
                <p className="mt-12 text-[10px] text-slate-400 uppercase tracking-widest">
                    © 2024 EcoLink AI. Precision Food Recovery.
                </p>
            </footer>
        </div>
    );
};

export default RoleSelection;