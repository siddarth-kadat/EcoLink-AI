import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';

const TopBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    // Dynamic fallback profile info
    const userName = user?.name || 'Demo User';
    const userRole = user?.role || 'Guest';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Close dropdowns on clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const mockNotifications = [
        { id: 1, text: "EcoMatch AI found 1 new compatible NGO match.", time: "2 mins ago" },
        { id: 2, text: "Volunteer claimed route for Donation #4029.", time: "10 mins ago" },
    ];

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between px-10 font-sans">
            {/* Search Input bar */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search donations, NGOs, or analytics..."
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-900/10 transition-all font-medium text-slate-750"
                />
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-6">
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        aria-label="Notifications"
                        className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                    </button>

                    {/* Notifications Panel Dropdown */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 space-y-3 z-50 text-left">
                            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Notifications</h5>
                            {mockNotifications.map((notif) => (
                                <div key={notif.id} className="text-xs py-1.5 hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer">
                                    <p className="font-semibold text-slate-800">{notif.text}</p>
                                    <span className="text-[10px] text-slate-450 mt-1 block">{notif.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-100" />

                {/* Profile Toggle Menu */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{userName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{userRole}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden group-hover:border-slate-900/10 transition-colors">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDown size={14} className="text-slate-450 group-hover:text-slate-900 transition-colors" />
                    </div>

                    {/* User profile actions dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2.5 z-50 text-left space-y-1">
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                            >
                                <UserIcon size={16} /> My Profile
                            </button>
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                            >
                                <SettingsIcon size={16} /> settings
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-bold text-rose-600 transition-colors"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;