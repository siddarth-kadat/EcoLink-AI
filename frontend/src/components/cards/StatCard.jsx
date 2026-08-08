import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, changeColor = "text-emerald-600 bg-emerald-50", icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-[180px]"
    >
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${color}`}>
                <Icon size={20} />
            </div>
            {change && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${changeColor}`}>
                    {change}
                </span>
            )}
        </div>
        <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

export default StatCard;
