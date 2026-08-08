import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Navigation, Activity, Download, RotateCw, AlertCircle, PlusCircle, CheckCircle2, ShieldAlert, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import { dashboardService } from '../../services/dashboardService';

const chartData = [
    { name: 'Day 1', accuracy: 88 },
    { name: 'Day 5', accuracy: 90 },
    { name: 'Day 10', accuracy: 92 },
    { name: 'Day 15', accuracy: 94 },
    { name: 'Day 20', accuracy: 93 },
    { name: 'Day 25', accuracy: 95 },
    { name: 'Day 30', accuracy: 94.2 }
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Dynamic UI Interaction states
    const [toastMsg, setToastMsg] = useState(null);
    const [allUsersModal, setAllUsersModal] = useState(false);
    const [activeActionIndex, setActiveActionIndex] = useState(null);

    const triggerToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 4000);
    };

    const handleUserStatusUpdate = (index, newStatus) => {
        if (!stats || !stats.recentUserActivations) return;
        const updatedActivations = stats.recentUserActivations.map((user, i) => {
            if (i === index) {
                return { ...user, status: newStatus };
            }
            return user;
        });
        setStats({
            ...stats,
            recentUserActivations: updatedActivations
        });
    };

    const fetchAdminStats = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const response = await dashboardService.getAdminStats();
            setStats(response.data);
        } catch (err) {
            console.error("Failed to load admin stats", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const handleExport = () => {
        const report = {
            title: "EcoLink AI - Control Center Report",
            timestamp: new Date().toLocaleString(),
            summary: {
                totalRescues: "42,891 MT",
                activeRegions: 156,
                systemEfficiency: "94.2%"
            },
            alertsCount: stats?.alerts?.length || 0,
            alerts: stats?.alerts || []
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ecolink_admin_report_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        triggerToast("Report exported successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#4F7DF3] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 font-sans text-left relative">
            {/* Toast Notification */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 bg-[#0B1026] text-white border border-slate-800 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 text-xs font-bold font-sans tracking-wide animate-pulse">
                    <CheckCircle2 className="text-emerald-500" size={18} /> {toastMsg}
                </div>
            )}

            {/* View All Registered Users Modal */}
            {allUsersModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl max-w-2xl w-full p-8 space-y-6 relative text-left">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold text-slate-900">All Registered Network Users</h4>
                            <button 
                                onClick={() => setAllUsersModal(false)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-900 focus:outline-none"
                            >
                                Close [x]
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-2 divide-y divide-slate-50">
                            {stats?.recentUserActivations?.map((u, i) => (
                                <div key={i} className="flex justify-between items-center py-4 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                                    <div>
                                        <p className="font-extrabold text-slate-900">{u.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{u.role} • {u.region}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[8px] font-bold uppercase tracking-wide ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {u.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Control Center</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Real-time system health and logistics metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="px-5 py-3 border border-slate-200 text-slate-800 rounded-2xl font-bold hover:bg-slate-50 transition-all text-xs flex items-center gap-2"
                    >
                        <Download size={14} /> Export Report
                    </button>
                    <button 
                        onClick={() => fetchAdminStats(true)}
                        disabled={refreshing}
                        className="px-6 py-3 bg-[#0B1026] text-white rounded-2xl font-bold hover:bg-slate-850 transition-all text-xs flex items-center gap-2 shadow-sm disabled:opacity-80"
                    >
                        <RotateCw size={14} className={refreshing ? "animate-spin" : ""} /> {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Rescues (MT)" 
                    value="42,891" 
                    change="+12.4%" 
                    changeColor="text-emerald-600 bg-emerald-50"
                    icon={Users} 
                    color="bg-orange-50 text-orange-655" 
                />
                <StatCard 
                    title="Active Regions" 
                    value="156" 
                    change="+3 New" 
                    changeColor="text-blue-600 bg-blue-50"
                    icon={Navigation} 
                    color="bg-blue-50 text-blue-600" 
                />
                <StatCard 
                    title="System Efficiency" 
                    value="94.2%" 
                    change="-1.2%" 
                    changeColor="text-rose-600 bg-rose-50"
                    icon={Activity} 
                    color="bg-emerald-50 text-emerald-600" 
                />
            </div>

            {/* Middle Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (Span 8) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Urgent Alerts panel */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
                            <AlertCircle className="text-rose-500" size={18} /> Urgent Alerts
                        </div>
                        <div className="space-y-6 text-left">
                            <div className="relative pl-3 border-l-2 border-rose-500">
                                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Stalled Donation: ID-492
                                </h5>
                                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                                    Bakery Goods (80lbs) waiting +2hrs in Dharwad. No volunteer matched.
                                </p>
                                <button 
                                    onClick={() => triggerToast("Success: Recalculating AI recommendation for Donation ID-492. Dispatch alert sent to Dharwad volunteers.")}
                                    className="mt-3 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider focus:outline-none"
                                >
                                    Force Match Action
                                </button>
                            </div>

                            <div className="relative pl-3 border-l-2 border-amber-500">
                                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Temperature Warning
                                </h5>
                                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                                    Vehicle V-102 reporting elevated temp (42F) during transport.
                                </p>
                                <button 
                                    onClick={() => triggerToast("Success: Connection opened to vehicle V-102 driver. Delivery warning pinged.")}
                                    className="mt-3 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider focus:outline-none"
                                >
                                    Contact Driver
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent User Activations panel */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-bold text-slate-900">Recent User Activations</h4>
                            <button 
                                onClick={() => setAllUsersModal(true)}
                                className="text-[10px] font-bold text-slate-450 hover:text-slate-900 focus:outline-none"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-5 text-xs text-left">
                            {stats?.recentUserActivations?.slice(0, 3).map((user, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 relative">
                                    <div>
                                        <p className="font-extrabold text-slate-955">{user.name}</p>
                                        <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">{user.role} • {user.region}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider font-semibold ${
                                            user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                            user.status === 'Suspended' ? 'bg-rose-50 text-rose-600' :
                                            'bg-amber-50 text-amber-650'
                                        }`}>
                                            {user.status}
                                        </span>
                                        <button 
                                            onClick={() => setActiveActionIndex(activeActionIndex === i ? null : i)}
                                            className="text-slate-400 hover:text-slate-900 focus:outline-none"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                    {activeActionIndex === i && (
                                        <div className="absolute right-0 top-10 bg-white border border-slate-100 shadow-xl rounded-xl p-2 z-10 space-y-1 w-36">
                                            <button 
                                                onClick={() => { 
                                                    handleUserStatusUpdate(i, 'Active'); 
                                                    triggerToast(`${user.name} approved successfully`); 
                                                    setActiveActionIndex(null); 
                                                }} 
                                                className="w-full text-[10px] font-bold text-left px-2 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700"
                                            >
                                                Approve Node
                                            </button>
                                            <button 
                                                onClick={() => { 
                                                    handleUserStatusUpdate(i, 'Suspended'); 
                                                    triggerToast(`${user.name} suspended`); 
                                                    setActiveActionIndex(null); 
                                                }} 
                                                className="w-full text-[10px] font-bold text-left px-2 py-1.5 hover:bg-rose-50 text-rose-600 rounded-lg"
                                            >
                                                Suspend
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Span 4) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* System Status Dashboard Card */}
                    <div className="bg-slate-50 border border-slate-100 p-8 rounded-[40px] space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Network Status</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Node Health</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500">API Endpoint Status</span>
                                <span className="text-emerald-600 font-bold">Online</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500">EcoMatch Engine</span>
                                <span className="text-emerald-600 font-bold">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500">Database Connection</span>
                                <span className="text-emerald-600 font-bold">Stable</span>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200/50" />

                        <div className="text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Dispatch Routes</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">12 Drivers</p>
                            <span className="text-[9px] text-slate-500 mt-1 block">Within Hubballi & Dharwad</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
