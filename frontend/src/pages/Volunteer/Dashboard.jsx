import React, { useState, useEffect } from 'react';
import { MapPin, Package, Navigation, Heart, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import TaskItem from '../../components/cards/TaskItem';
import { donationService } from '../../services/donationService';
import { getTimeRemaining } from '../../utils/helpers';
import LeafletMap from '../../components/maps/LeafletMap';

const VolunteerDashboard = () => {
    const [availableTasks, setAvailableTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [claimingId, setClaimingId] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const loadVolunteerData = async () => {
        try {
            const [availableRes, myRes] = await Promise.all([
                donationService.getAvailableTasks(),
                donationService.getMyTasks()
            ]);
            setAvailableTasks(availableRes.data);
            
            // First pending task is active
            const active = myRes.data.find(d => d.delivery_status !== 'Delivered');
            setActiveTask(active || null);
        } catch (err) {
            console.error("Failed to load volunteer data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVolunteerData();
    }, []);

    const handleAcceptTask = async (deliveryId) => {
        setClaimingId(deliveryId);
        setMessage(null);
        setError(null);
        try {
            await donationService.acceptTask(deliveryId);
            setMessage("Task claimed successfully! Follow the route below.");
            await loadVolunteerData();
        } catch (err) {
            console.error("Failed to accept task", err);
            setError(err.response?.data?.detail || "Failed to claim task.");
        } finally {
            setClaimingId(null);
        }
    };

    const handleConfirmPickup = async (deliveryId) => {
        setActionLoading(true);
        setMessage(null);
        setError(null);
        try {
            await donationService.confirmPickup(deliveryId);
            setMessage("Food pickup logged successfully. Transit to the target NGO.");
            await loadVolunteerData();
        } catch (err) {
            console.error("Failed to confirm pickup", err);
            setError(err.response?.data?.detail || "Failed to log pickup.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelivery = async (deliveryId) => {
        setActionLoading(true);
        setMessage(null);
        setError(null);
        try {
            await donationService.confirmDelivery(deliveryId);
            setMessage("Delivery completed successfully! Great job rescuing food!");
            await loadVolunteerData();
        } catch (err) {
            console.error("Failed to confirm delivery", err);
            setError(err.response?.data?.detail || "Failed to log delivery.");
        } finally {
            setActionLoading(false);
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
        <div className="space-y-8 font-sans text-left">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Volunteer Portal</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Active routes and your impact</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm text-center min-w-[90px]">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Deliveries</p>
                        <p className="text-lg font-black text-slate-900 mt-0.5">42</p>
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm text-center min-w-[90px]">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Lbs Rescued</p>
                        <p className="text-lg font-black text-slate-900 mt-0.5">840</p>
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm text-center min-w-[90px]">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Points Earned</p>
                        <p className="text-lg font-black text-slate-900 mt-0.5">1,200</p>
                    </div>
                </div>
            </header>

            {message && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Active Task (Left Side) */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#0B1026] text-white rounded-xl flex items-center justify-center">
                                    <Navigation size={20} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">Active Task</h4>
                            </div>
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                                In Progress
                            </span>
                        </div>

                        {activeTask ? (
                            <div className="space-y-8">
                                <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:border-l before:border-dashed before:border-slate-300">
                                    {/* Pickup Details */}
                                    <div className="relative">
                                        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-white border border-slate-400 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pickup</p>
                                            <p className="text-sm font-extrabold text-slate-950">{activeTask.donation.pickup_location || 'Restaurant A'}</p>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">123 Culinary Ave, City Center</p>
                                        </div>
                                    </div>

                                    {/* Drop-off Details */}
                                    <div className="relative">
                                        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-[#0B1026] flex items-center justify-center">
                                            <MapPin size={10} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Drop-off</p>
                                            <p className="text-sm font-extrabold text-slate-950">NGO B - Community Shelter</p>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">456 Hope Blvd, Westside</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Map View */}
                                <div className="h-80 relative overflow-hidden rounded-2xl border border-slate-100 mb-6">
                                    <LeafletMap 
                                        pickupLoc={activeTask.donation.pickup_location}
                                        deliveryLoc={activeTask.donation.destination || 'Hope Mission'}
                                        courierStatus={activeTask.pickup_status === 'Pending' ? 'Claimed' : 'Picked Up'}
                                    />
                                </div>

                                <div className="mt-8 flex gap-4">
                                    {activeTask.pickup_status === 'Pending' ? (
                                        <button
                                            onClick={() => handleConfirmPickup(activeTask.delivery_id)}
                                            disabled={actionLoading}
                                            className="flex-1 py-3.5 bg-[#0B1026] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-850 transition-all shadow-sm disabled:opacity-50 text-xs uppercase tracking-wider"
                                        >
                                            Confirm Food Pickup
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleConfirmDelivery(activeTask.delivery_id)}
                                            disabled={actionLoading}
                                            className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 text-xs uppercase tracking-wider"
                                        >
                                            Confirm Delivery Completion
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4 border border-dashed border-slate-200 rounded-[32px] p-8">
                                <Package size={48} className="mx-auto text-slate-350" />
                                <p className="text-slate-500 font-medium text-sm">No active dispatches. Claim an available route nearby to start.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Tasks (Right Side) */}
                <div className="lg:col-span-4 bg-slate-50 p-6 rounded-[40px] border border-slate-200/50">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-md">
                            Available Deliveries
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                            {availableTasks.length} Nearby
                        </span>
                    </div>

                    <div className="space-y-4">
                        {availableTasks.length === 0 ? (
                            <div className="py-10 text-center text-slate-450 text-xs font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
                                All routes claimed! Check back later.
                            </div>
                        ) : (
                            availableTasks.map((task) => (
                                <TaskItem
                                    key={task.delivery_id}
                                    title={task.donation.food_type}
                                    distance={task.donation.pickup_location}
                                    weight={task.donation.quantity}
                                    time={getTimeRemaining(task.donation.expiry_time)}
                                    type={task.pickup_status}
                                    claiming={claimingId === task.delivery_id}
                                    onAccept={() => handleAcceptTask(task.delivery_id)}
                                    onViewDetails={() => setSelectedTask(task)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl max-w-md w-full p-8 space-y-6 relative text-left">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold text-slate-900">Delivery Route Details</h4>
                            <button 
                                onClick={() => setSelectedTask(null)}
                                className="text-xs font-bold text-slate-450 hover:text-slate-900 focus:outline-none"
                            >
                                Close [x]
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Food Supplies</p>
                                <p className="text-sm font-extrabold text-slate-950">{selectedTask.donation.food_type}</p>
                                <p className="text-xs text-slate-450 font-medium">{selectedTask.donation.quantity} portions</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Source (Pickup Address)</p>
                                <p className="text-sm font-extrabold text-slate-950">{selectedTask.donation.pickup_location}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Destination (NGO Hand-off)</p>
                                <p className="text-sm font-extrabold text-slate-950">{selectedTask.donation.destination || 'Hope Mission'}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expiration Window</p>
                                <p className="text-sm font-extrabold text-slate-950">{getTimeRemaining(selectedTask.donation.expiry_time)} remaining</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                handleAcceptTask(selectedTask.delivery_id);
                                setSelectedTask(null);
                            }}
                            className="w-full py-3.5 bg-[#0B1026] hover:bg-slate-800 text-white rounded-2xl font-bold transition-all text-xs uppercase tracking-wider"
                        >
                            Accept Task & Route
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerDashboard;