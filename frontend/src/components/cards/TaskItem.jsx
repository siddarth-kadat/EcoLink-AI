import React from 'react';
import { Package, Clock, MapPin } from 'lucide-react';

const TaskItem = ({ title, distance, weight, time, type, onAccept, claiming, onViewDetails }) => (
    <div className="p-5 bg-white rounded-3xl border border-slate-100 hover:shadow-md transition-all group cursor-pointer">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary-soft group-hover:text-primary transition-colors">
                    <Package size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{type}</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                <Clock size={12} /> {time} est.
            </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {distance}</span>
            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-1.5">~{weight} servings</span>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={onViewDetails}
                className="flex-1 py-2.5 bg-slate-100 text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors focus:outline-none"
            >
                View Details
            </button>
            <button
                onClick={onAccept}
                disabled={claiming}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {claiming ? 'Accepting...' : 'Accept'}
            </button>
        </div>
    </div>
);

export default TaskItem;
