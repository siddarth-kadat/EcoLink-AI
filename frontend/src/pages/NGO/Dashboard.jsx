import React, { useState, useEffect } from 'react';
import { Inbox, Package, Users, Heart, ChevronRight, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import RequestItem from '../../components/cards/RequestItem';
import { dashboardService } from '../../services/dashboardService';
import { donationService } from '../../services/donationService';
import { recommendationService } from '../../services/recommendationService';
import { getTimeRemaining } from '../../utils/helpers';

const NGODashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState(null);

    const loadDashboardData = async () => {
        try {
            const [statsRes, requestsRes] = await Promise.all([
                dashboardService.getNGOStats(),
                donationService.getIncomingDonations()
            ]);
            setStats(statsRes.data);
            setRequests(requestsRes.data);
        } catch (err) {
            console.error("Failed to load NGO dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handleClaim = async (recId) => {
        setClaimingId(recId);
        try {
            await recommendationService.acceptRecommendation(recId);
            // Refresh data after claiming
            await loadDashboardData();
        } catch (err) {
            console.error("Failed to claim recommendation", err);
        } finally {
            setClaimingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 text-left">
            <header>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">NGO Dashboard</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Overview of your food recovery operations</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Incoming Donations" value={stats?.incomingDonations || '0'} icon={Inbox} color="bg-orange-50 text-orange-600" />
                <StatCard title="Items in Inventory" value={stats?.itemsInInventory || '0'} icon={Package} color="bg-blue-50 text-blue-600" />
                <StatCard title="Active Volunteers" value={stats?.activeVolunteers || '0'} icon={Users} color="bg-emerald-50 text-emerald-600" />
                <StatCard title="Families Fed This Week" value={stats?.familiesFed || '0'} icon={Heart} color="bg-rose-50 text-rose-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Requests Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-xl font-bold text-slate-900">Incoming Requests</h4>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => {
                                        setLoading(true);
                                        loadDashboardData();
                                    }} 
                                    className="text-xs font-bold text-slate-450 hover:text-slate-900 focus:outline-none"
                                >
                                    Refresh
                                </button>
                                <button onClick={() => navigate('/incoming-donations')} className="text-xs font-bold text-primary hover:underline">View All</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {requests.filter(rec => rec.donation && rec.donation.status === 'Available').length === 0 ? (
                                <div className="p-10 text-center text-slate-450 text-xs font-medium">No matching requests found today.</div>
                            ) : (
                                requests.filter(rec => rec.donation && rec.donation.status === 'Available').map((rec) => (
                                    <RequestItem
                                        key={rec.recommendation_id}
                                        restaurant={rec.donation.pickup_location}
                                        items={`${rec.donation.food_type} (${rec.donation.quantity} portions)`}
                                        timeLeft={getTimeRemaining(rec.donation.expiry_time)}
                                        matchScore={Math.round(rec.confidence_score * 100)}
                                        claiming={claimingId === rec.recommendation_id}
                                        onClaim={() => handleClaim(rec.recommendation_id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xl font-bold text-slate-900">Inventory Distribution</h4>
                            <PieIcon size={20} className="text-slate-400" />
                        </div>
                        <div className="relative h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.inventoryDistribution || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {stats?.inventoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute flex flex-col items-center justify-center pb-2">
                                <span className="text-2xl font-black text-slate-900">1.2k</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6">
                            {stats?.inventoryDistribution.map((item) => (
                                <div key={item.name} className="flex justify-between items-center text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-600">{item.name}</span>
                                    </div>
                                    <span className="text-slate-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-6">Recent Pickups</h4>
                        <div className="space-y-6">
                            {stats?.recentPickups.map((pickup, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                        <Users size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{pickup.name}</p>
                                        <p className="text-xs text-slate-500 mb-1">{pickup.status}</p>
                                        <span className="text-[10px] text-primary font-bold uppercase tracking-tight">{pickup.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NGODashboard;