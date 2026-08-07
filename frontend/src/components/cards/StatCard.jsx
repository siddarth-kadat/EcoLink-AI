import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon size={24} />
            </div>
            {change && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={12} /> {change}
                </span>
            )}
        </div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
    </motion.div>
);

export default StatCard;
