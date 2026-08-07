import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    History,
    Truck,
    BrainCircuit,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';

const Sidebar = ({ role = 'restaurant' }) => {
    const navItems = [
        { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Create Donation', icon: PlusCircle, path: '/create-donation' },
        { label: 'History', icon: History, path: '/history' },
        { label: 'Tracking', icon: Truck, path: '/tracking' },
        { label: 'AI Recommendations', icon: BrainCircuit, path: '/recommendations' },
        { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 hidden lg:flex flex-col p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin-slow" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-lg text-slate-900 leading-none">EcoLink AI</h1>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">Food Rescue Platform</p>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-primary-soft text-primary font-semibold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'}
            `}
                    >
                        <item.icon size={20} />
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-1">
                <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                    <Settings size={20} />
                    <span className="text-sm">Settings</span>
                </NavLink>
                <NavLink to="/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                    <HelpCircle size={20} />
                    <span className="text-sm">Support</span>
                </NavLink>

                <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white">
                    <p className="text-xs font-medium opacity-70">Enterprise Plan</p>
                    <button className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;