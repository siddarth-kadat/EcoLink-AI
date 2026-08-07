import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, MoreHorizontal, Plus, ArrowRight } from 'lucide-react';
import TaskItem from '../../components/cards/TaskItem';
import { donationService } from '../../services/donationService';

const VolunteerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await donationService.getAvailableTasks();
                setTasks(response.data);
            } catch (err) {
                console.error("Failed to load volunteer tasks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
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
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-display font-bold text-slate-900">Volunteer Portal</h2>
                    <p className="text-slate-500 mt-1">Active routes and your impact</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Deliveries</p>
                        <p className="text-xl font-bold text-slate-900">42</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lbs Rescued</p>
                        <p className="text-xl font-bold text-slate-900">840</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Points Earned</p>
                        <p className="text-xl font-bold text-slate-900">1,200</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Active Task */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                    <Navigation size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Active Task</h4>
                                    <p className="text-xs text-slate-500">Pickup and delivery in progress</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                In Progress
                            </div>
                        </div>

                        <div className="space-y-12 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-dashed before:bg-slate-200">
                            <div className="flex gap-6 relative">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shrink-0 z-10">
                                    <div className="w-2 h-2 bg-slate-900 rounded-full" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                                    <p className="text-lg font-bold text-slate-900">Restaurant A</p>
                                    <p className="text-sm text-slate-500">123 Culinary Ave, City Center</p>
                                </div>
                            </div>

                            <div className="flex gap-6 relative">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 z-10">
                                    <MapPin size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drop-off</p>
                                    <p className="text-lg font-bold text-slate-900">NGO B - Community Shelter</p>
                                    <p className="text-sm text-slate-500">456 Hope Blvd, Westside</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 h-64 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center gap-4 text-slate-400">
                            <Navigation size={48} className="opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">Map View Integration</p>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                <Navigation size={18} fill="currentColor" /> Start Route
                            </button>
                            <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Available Tasks */}
                <div className="lg:col-span-4 bg-slate-50 p-6 rounded-[40px] border border-slate-200/50">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Plus className="text-primary" size={20} /> Available Deliveries
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{tasks.length} Nearby</span>
                    </div>

                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                title={task.title}
                                distance={task.distance}
                                weight={task.weight}
                                time={task.time}
                                type={task.type}
                            />
                        ))}
                    </div>

                    <button className="w-full mt-6 py-4 text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2 group">
                        View All Tasks <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;