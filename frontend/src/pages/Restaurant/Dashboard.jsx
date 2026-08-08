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

    // Interactive states
    const [timeframe, setTimeframe] = useState('7');
    const [activityModal, setActivityModal] = useState(false);

    // Compute different weekly/monthly trend shapes based on dropdown selection
    const chartData = React.useMemo(() => {
        if (!stats || !stats.trend) return [];
        if (timeframe === '7') {
            return stats.trend.slice(0, 7);
        } else {
            // Generate a simulated 30-day curve by interpolating trend weights
            const base = stats.trend;
            const expanded = [];
            for (let i = 1; i <= 30; i += 4) {
                const idx = Math.min(Math.floor((i - 1) / 4), base.length - 1);
                expanded.push({
                    name: `Day ${i}`,
                    pounds: base[idx] ? base[idx].pounds + Math.floor(Math.sin(i) * 18) : 120 + i * 3
                });
            }
            return expanded;
        }
    }, [stats, timeframe]);

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
        <div className="space-y-8 relative">
            {/* View All Activities Modal Overlay */}
            {activityModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl max-w-2xl w-full p-8 space-y-6 relative text-left">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold text-slate-900">All Recent Activities</h4>
                            <button 
                                onClick={() => setActivityModal(false)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-900 focus:outline-none"
                            >
                                Close [x]
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-2 divide-y divide-slate-50">
                            {stats?.activities?.map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 py-4 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                                    <div className={`p-2.5 rounded-full ${
                                        activity.type === 'pickup' ? 'bg-slate-50 text-slate-650' : 
                                        activity.type === 'match' ? 'bg-primary-soft text-primary' : 
                                        activity.type === 'log' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {activity.type === 'pickup' ? <Package size={16} /> : activity.type === 'match' ? <ArrowUpRight size={16} /> : activity.type === 'log' ? <Plus size={16} /> : <Clock size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-extrabold text-slate-900 text-xs">{activity.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{activity.desc}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-bold">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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
                    changeColor="text-emerald-600 bg-emerald-50"
                    icon={Users}
                    color="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Active Donations"
                    value={stats?.activeDonations || '0'}
                    change="Today"
                    changeColor="text-slate-500 bg-slate-50"
                    icon={Package}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Successful Deliveries"
                    value={stats?.deliverySuccess || '0%'}
                    change="+4%"
                    changeColor="text-emerald-600 bg-emerald-50"
                    icon={CheckCircle2}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="AI Match Success"
                    value={stats?.matchSuccess || '0%'}
                    change="High Confidence"
                    changeColor="text-purple-600 bg-purple-50"
                    icon={ArrowUpRight}
                    color="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-slate-900">Donation Impact Trend</h4>
                        <select 
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-0 cursor-pointer focus:outline-none"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
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
                    
                    {/* Have Surplus Food banner */}
                    <div className="mt-8 p-8 bg-[#0B1026] text-white rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                        <div className="relative z-10 text-left">
                            <h5 className="text-lg font-bold">Have surplus food today?</h5>
                            <p className="text-white/60 text-xs mt-1 leading-relaxed max-w-xl font-medium">
                                Our AI is currently predicting high demand in your area. Log a donation now for immediate routing.
                            </p>
                        </div>
                        <button onClick={() => navigate('/create-donation')} className="whitespace-nowrap px-6 py-3.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                            Create Donation
                        </button>
                        <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-[#4F7DF3]/15 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-full text-left">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-bold text-slate-900">Recent Activity</h4>
                        <button 
                            onClick={() => setActivityModal(true)}
                            className="text-xs font-bold text-primary hover:underline focus:outline-none"
                        >
                            View All
                        </button>
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
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;