import React from 'react';

const ActivityItem = ({ title, desc, time, icon: Icon, iconBg }) => (
    <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <span className="text-[10px] text-slate-400 font-medium uppercase">{time}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default ActivityItem;
