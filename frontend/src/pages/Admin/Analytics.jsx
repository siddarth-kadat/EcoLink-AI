import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreVertical, Download, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import { dashboardService } from '../../services/dashboardService';

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Interaction states
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

    const loadAdminData = async (isRefresh = false) => {
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
        loadAdminData();
    }, []);

    const handleExport = () => {
        const report = {
            title: "EcoLink AI - Global Network Analytics Report",
            timestamp: new Date().toLocaleString(),
            summary: {
                totalRescues: "42,891 MT",
                activeRegions: 156,
                systemEfficiency: "94.2%"
            },
            regionsCount: stats?.topCities?.length || 0,
            cities: stats?.topCities || []
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ecolink_analytics_report_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        triggerToast("Report exported successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 relative">
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

            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-display font-bold text-slate-900">Global Network Analytics</h2>
                    <p className="text-slate-500 mt-1 text-lg">Real-time insights across the EcoLink platform.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                        <Download size={18} /> Export Report
                    </button>
                    <button 
                        onClick={() => loadAdminData(true)} 
                        disabled={refreshing}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/10 disabled:opacity-85"
                    >
                        <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} /> {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Total Rescues (MT)" value={stats?.totalRescues || '0'} change="+12.4%" icon={Globe} color="bg-slate-50 text-slate-955" />
                <StatCard title="Active Regions" value={stats?.activeRegions || '0'} change="+3 New" icon={BarChart3} color="bg-slate-50 text-slate-955" />
                <StatCard title="System Efficiency" value={stats?.systemEfficiency || '0%'} change="-1.2%" icon={Zap} color="bg-slate-50 text-slate-955" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-2xl font-bold text-slate-900">AI Match Accuracy Trend</h4>
                            <p className="text-sm text-slate-500">30-day performance of recommendation engine</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                            <span className="text-xs font-bold text-slate-900">Accuracy %</span>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trend || []}>
                                <defs>
                                    <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#064E3B" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#064E3B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="accuracy" stroke="#064E3B" strokeWidth={4} fill="url(#adminGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts Panel */}
                <div className="lg:col-span-4 bg-rose-50/30 p-10 rounded-[40px] border border-rose-100">
                    <div className="flex items-center gap-3 mb-10 text-rose-600">
                        <AlertTriangle size={24} />
                        <h4 className="text-2xl font-bold">Urgent Alerts</h4>
                    </div>
                    <div className="space-y-6">
                        {stats?.alerts.map((alert, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group text-left">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold text-rose-600 uppercase tracking-tighter">{alert.type}: {alert.id}</p>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">{alert.desc}</p>
                                <button 
                                    onClick={() => triggerToast(`Alert Action executed: ${alert.action} for ${alert.id}`)}
                                    className="text-xs font-bold text-slate-900 underline underline-offset-4 hover:text-rose-600 transition-colors focus:outline-none"
                                >
                                    {alert.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* City Stats */}
                <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Top Cities</h4>
                    <p className="text-sm text-slate-500 mb-10">By volume recovered this week</p>
                    <div className="space-y-8">
                        {stats?.topCities.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400">{i + 1}.</span>
                                        <span className="text-base font-bold text-slate-900">{item.city}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-505">{item.volume}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Management Table Preview */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10 text-left">
                        <div>
                            <h4 className="text-2xl font-bold text-slate-900">Recent User Activations</h4>
                            <p className="text-sm text-slate-500">Monitoring new network participants</p>
                        </div>
                        <button 
                            onClick={() => setAllUsersModal(true)}
                            className="text-sm font-bold text-primary hover:underline focus:outline-none"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity Name</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Role</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Region</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats?.recentUserActivations.map((user, i) => (
                                    <tr key={i} className="group">
                                        <td className="py-6 text-left">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900 group-hover:bg-primary-soft group-hover:text-primary transition-colors">
                                                    {user.icon}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{user.role}</span>
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className="text-sm text-slate-500">{user.region}</span>
                                        </td>
                                        <td className="py-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    user.status === 'Active' ? 'bg-emerald-500' :
                                                    user.status === 'Suspended' ? 'bg-rose-500' :
                                                    'bg-orange-400'
                                                }`} />
                                                <span className="text-xs font-bold text-slate-900">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right text-slate-400 hover:text-slate-900 cursor-pointer relative">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setActiveActionIndex(activeActionIndex === i ? null : i); }}
                                                className="focus:outline-none"
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            {activeActionIndex === i && (
                                                <div className="absolute right-0 top-12 bg-white border border-slate-100 shadow-xl rounded-xl p-2 z-10 space-y-1 w-36 text-left">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
