import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreVertical, Download, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import { dashboardService } from '../../services/dashboardService';

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadAdminData = async () => {
        setLoading(true);
        try {
            const response = await dashboardService.getAdminStats();
            setStats(response.data);
        } catch (err) {
            console.error("Failed to load admin stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-display font-bold text-slate-900">Global Network Analytics</h2>
                    <p className="text-slate-500 mt-1 text-lg">Real-time insights across the EcoLink platform.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 hover:bg-slate-50">
                        <Download size={18} /> Export Report
                    </button>
                    <button onClick={loadAdminData} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/10">
                        <RefreshCcw size={18} /> Refresh Data
                    </button>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Total Rescues (MT)" value={stats?.totalRescues || '0'} change="+12.4%" icon={Globe} color="bg-slate-50 text-slate-950" />
                <StatCard title="Active Regions" value={stats?.activeRegions || '0'} change="+3 New" icon={BarChart3} color="bg-slate-50 text-slate-950" />
                <StatCard title="System Efficiency" value={stats?.systemEfficiency || '0%'} change="-1.2%" icon={Zap} color="bg-slate-50 text-slate-950" />
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
                            <div key={i} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-xs font-bold text-rose-600 uppercase tracking-tighter">{alert.type}: {alert.id}</p>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">{alert.desc}</p>
                                <button className="text-xs font-bold text-slate-900 underline underline-offset-4 hover:text-rose-600 transition-colors">
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
                                    <span className="text-sm font-bold text-slate-500">{item.volume}</span>
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
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-2xl font-bold text-slate-900">Recent User Activations</h4>
                            <p className="text-sm text-slate-500">Monitoring new network participants</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline">View All</button>
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
                                        <td className="py-6">
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
                                                <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                                                <span className="text-xs font-bold text-slate-900">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right text-slate-400 hover:text-slate-900 cursor-pointer">
                                            <MoreVertical size={20} />
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
