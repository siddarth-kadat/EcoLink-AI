import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const TopBar = ({ user = { name: 'Alex Rivera', role: 'Restaurant Manager' } }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between px-10">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search donations, NGOs, or analytics..."
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button aria-label="Notifications" className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
                </button>

                <div className="h-8 w-px bg-slate-100" />

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-primary/20 transition-colors">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <ChevronDown size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;