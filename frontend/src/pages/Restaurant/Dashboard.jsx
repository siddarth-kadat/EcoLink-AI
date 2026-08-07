import React, { useState, useEffect } from 'react';
import { Plus, Users, Package, CheckCircle2, ArrowUpRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import ActivityItem from '../../components/cards/ActivityItem';
import { dashboardService } from '../../services/dashboardService';

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardService.getRestaurantStats();
                setStats(response.data);
            } catch (err) {
                console.error("Failed to load restaurant stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Restaurant Dashboard</h2>
                    <p className="text-slate-500 mt-1">Here is what is happening with your donations today.</p>
                </div>
                <button onClick={() => navigate('/create-donation')} className="btn-primary shadow-lg shadow-primary/20">
                    <Plus size={20} /> Create Donation
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Meals Donated"
                    value={stats?.mealsDonated || '0'}
                    change="+12%"
                    icon={Users}
                    color="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Active Donations"
                    value={stats?.activeDonations || '0'}
                    icon={Package}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Successful Deliveries"
                    value={stats?.deliverySuccess || '0%'}
                    change="+4%"
                    icon={CheckCircle2}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="AI Match Success"
                    value={stats?.matchSuccess || '0%'}
                    icon={ArrowUpRight}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-slate-900">Donation Impact Trend</h4>
                        <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-0">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trend || []}>
                                <defs>
                                    <linearGradient id="colorPounds" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#064E3B" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#064E3B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pounds"
                                    stroke="#064E3B"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPounds)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-slate-900">Recent Activity</h4>
                        <button className="text-xs font-bold text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-2">
                        {stats?.activities.map((activity) => (
                            <ActivityItem
                                key={activity.id}
                                title={activity.title}
                                desc={activity.desc}
                                time={activity.time}
                                icon={activity.type === 'pickup' ? Package : activity.type === 'match' ? ArrowUpRight : activity.type === 'log' ? Plus : Clock}
                                iconBg={activity.type === 'pickup' ? 'bg-slate-50 text-slate-600' : activity.type === 'match' ? 'bg-primary-soft text-primary' : activity.type === 'log' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}
                            />
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-slate-900 rounded-[32px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h5 className="text-white font-bold mb-2">Have surplus food today?</h5>
                            <p className="text-white/60 text-xs mb-4 leading-relaxed">Our AI is currently predicting high demand in your area.</p>
                            <button onClick={() => navigate('/create-donation')} className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                                Create Donation Now
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;