import React from 'react';
import { Inbox, Clock } from 'lucide-react';

const RequestItem = ({ restaurant, items, timeLeft, matchScore }) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Inbox size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-900">{restaurant}</p>
                <p className="text-xs text-slate-500">{items}</p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="text-right">
                <div className="flex items-center gap-1.5 text-orange-600 text-[10px] font-bold uppercase mb-0.5">
                    <Clock size={12} /> {timeLeft} left
                </div>
                <div className="px-2 py-0.5 bg-primary-soft text-primary rounded-md text-[10px] font-bold">
                    {matchScore}% Match
                </div>
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Claim
            </button>
        </div>
    </div>
);

export default RequestItem;
