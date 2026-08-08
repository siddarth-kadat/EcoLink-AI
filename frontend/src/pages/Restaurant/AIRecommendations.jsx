import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Navigation, RotateCw, Check, ArrowRight, ShieldCheck, Warehouse, ThermometerSnowflake, Clock } from 'lucide-react';

const AIRecommendations = () => {
    const [selectedPrimary, setSelectedPrimary] = useState(false);
    const [selectedAlt, setSelectedAlt] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);
    const [recalculating, setRecalculating] = useState(false);
    const [profileModal, setProfileModal] = useState(false);

    const triggerToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 4000);
    };

    const handleRecalculate = () => {
        setRecalculating(true);
        triggerToast("Analyzing real-time dispatch routes...");
        setTimeout(() => {
            setRecalculating(false);
            triggerToast("AI matching criteria updated successfully.");
        }, 1500);
    };

    const handleDispatch = () => {
        if (selectedPrimary) {
            triggerToast("Success: Dispatch matched! Route established to Akshaya Patra Foundation Hubli.");
        } else if (selectedAlt === 0) {
            triggerToast("Success: Dispatch matched! Route established to Dharwad Food Rescue Shelter.");
        } else if (selectedAlt === 1) {
            triggerToast("Success: Dispatch matched! Route established to Karnataka Janaseva Trust.");
        } else {
            triggerToast("Please select a recipient (Primary or Alternative) to dispatch.");
        }
    };

    return (
        <div className="space-y-10 font-sans text-left">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#4F7DF3] mb-1 font-bold text-xs uppercase tracking-widest">
                        <Sparkles size={14} /> Intelligence Engine
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recommended NGOs</h2>
                    <p className="text-sm text-slate-500 max-w-2xl mt-1.5 font-medium leading-relaxed">
                        Our AI has analyzed real-time local demand, logistical capacity, and matching algorithms to recommend the most optimal recipients for your pending donation.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => triggerToast("Filter parameters applied: Distance <= 5 miles, Capacity >= 25kg.")}
                        className="px-5 py-3 border border-slate-200 text-slate-800 rounded-2xl font-bold hover:bg-slate-50 transition-all text-xs flex items-center gap-2 focus:outline-none"
                    >
                        <SlidersHorizontal size={14} /> Filter Criteria
                    </button>
                    <button 
                        onClick={handleDispatch}
                        className="px-6 py-3 bg-[#0B1026] text-white rounded-2xl font-bold hover:bg-slate-850 transition-all text-xs flex items-center gap-2 shadow-sm focus:outline-none"
                    >
                        <Navigation size={14} /> Dispatch Selected
                    </button>
                </div>
            </div>

            {/* Top Match Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Top Match Details (Span 2) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden">
                    <div>
                        <div className="flex justify-between items-start gap-6">
                            <div>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                                    ★ Top Match
                                </span>
                                <h3 className="text-2xl font-extrabold text-slate-900">Akshaya Patra Foundation Hubli</h3>
                                <p className="text-xs text-slate-500 font-semibold mt-1">
                                    2.4 miles away • High Capacity Available
                                </p>
                            </div>
                            
                            {/* Circular Match Score Badge */}
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full border-4 border-[#4F7DF3] flex items-center justify-center text-xl font-black text-slate-900 bg-[#4F7DF3]/5">
                                    98%
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 block">Confidence Score</span>
                            </div>
                        </div>

                        {/* Progress Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                                    <span>Food Match Priority</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                                    <span>Logistical Ease</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#4F7DF3] rounded-full" style={{ width: '70%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                                    <span>Delivery Risk</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold mt-1 block">Minimal</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10 pt-6 border-t border-slate-50">
                        <button 
                            onClick={() => {
                                const nextState = !selectedPrimary;
                                setSelectedPrimary(nextState);
                                if (nextState) setSelectedAlt(null); // Deselect alt if primary selected
                                triggerToast(nextState ? "Akshaya Patra Foundation Hubli selected as primary recipient." : "Akshaya Patra Foundation Hubli unselected.");
                            }}
                            className={`px-8 py-3.5 rounded-2xl font-bold transition-all text-xs flex items-center gap-2 shadow-sm focus:outline-none ${selectedPrimary ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#0B1026] text-white hover:bg-slate-800'}`}
                        >
                            {selectedPrimary ? <Check size={14} /> : null} {selectedPrimary ? 'Selected' : 'Select as Primary'}
                        </button>
                        <button 
                            onClick={() => setProfileModal(true)}
                            className="px-8 py-3.5 border border-slate-200 text-slate-850 rounded-2xl font-bold hover:bg-slate-50 transition-all text-xs focus:outline-none"
                        >
                            View Profile
                        </button>
                    </div>
                </div>

                {/* Right Why Was This Selected Panel */}
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200/50 space-y-6">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-800 uppercase tracking-wider">
                        <ShieldCheck className="text-[#4F7DF3]" size={18} /> Why was this selected?
                    </div>

                    <ul className="space-y-6 text-left">
                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-[#4F7DF3]/10 text-[#4F7DF3] rounded-xl shrink-0 mt-0.5">
                                <Warehouse size={16} />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900">Perfect Nutritional Alignment</h5>
                                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                                    Your donation contains a high ratio of fresh produce, which perfectly matches their current deficit.
                                </p>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-[#4F7DF3]/10 text-[#4F7DF3] rounded-xl shrink-0 mt-0.5">
                                <ThermometerSnowflake size={16} />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900">Optimal Cold Storage</h5>
                                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                                    They have recently reported 80% available capacity in their walk-in freezers, ideal for your perishables.
                                </p>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <div className="p-2 bg-[#4F7DF3]/10 text-[#4F7DF3] rounded-xl shrink-0 mt-0.5">
                                <Clock size={16} />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-900">Immediate Volunteer</h5>
                                <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                                    A verified driver is active nearby and ready to accept the routing request.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Alternative Matches Section */}
            <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-900">Alternative High-Viability Matches</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Alt Card 1 */}
                    <div 
                        onClick={() => {
                            const nextState = selectedAlt === 0 ? null : 0;
                            setSelectedAlt(nextState);
                            if (nextState !== null) setSelectedPrimary(false); // Deselect primary
                            triggerToast(nextState !== null ? "Dharwad Food Rescue Shelter selected as dispatch target." : "Dharwad Food Rescue Shelter unselected.");
                        }}
                        className={`p-6 rounded-[32px] border transition-all flex flex-col justify-between h-56 cursor-pointer shadow-sm ${
                            selectedAlt === 0 ? 'bg-white border-emerald-500 ring-2 ring-emerald-550/10' : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                    >
                        <div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Dharwad Food Rescue Shelter</h5>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">4.1 miles away • Moderate Capacity</p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">89% Match</span>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                        <span>Food Priority</span>
                                        <span>High</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-4">
                            <span>Delivery Risk</span>
                            <span className="text-slate-800">Low (8%)</span>
                        </div>
                    </div>

                    {/* Alt Card 2 */}
                    <div 
                        onClick={() => {
                            const nextState = selectedAlt === 1 ? null : 1;
                            setSelectedAlt(nextState);
                            if (nextState !== null) setSelectedPrimary(false); // Deselect primary
                            triggerToast(nextState !== null ? "Karnataka Janaseva Trust selected as dispatch target." : "Karnataka Janaseva Trust unselected.");
                        }}
                        className={`p-6 rounded-[32px] border transition-all flex flex-col justify-between h-56 cursor-pointer shadow-sm ${
                            selectedAlt === 1 ? 'bg-white border-emerald-500 ring-2 ring-emerald-550/10' : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                    >
                        <div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">Karnataka Janaseva Trust</h5>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">5.8 miles away • High Capacity</p>
                                </div>
                                <span className="text-[10px] font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">82% Match</span>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                        <span>Food Priority</span>
                                        <span>Medium</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-4">
                            <span>Delivery Risk</span>
                            <span className="text-slate-800">Low (12%)</span>
                        </div>
                    </div>

                    {/* Recalculate Widget Card */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] flex flex-col justify-between h-56 text-center items-center">
                        <div 
                            onClick={handleRecalculate}
                            className={`w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform ${recalculating ? 'animate-spin' : ''}`}
                        >
                            <RotateCw size={16} />
                        </div>
                        <div>
                            <h5 className="text-xs font-bold text-slate-900">Recalculate Matches</h5>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-[180px] leading-relaxed">
                                Adjust parameters to see different outcome structures.
                            </p>
                        </div>
                        <div />
                    </div>
                </div>
            </div>

            {/* Profile Modal Overlay */}
            {profileModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl max-w-md w-full p-8 space-y-6 relative text-left">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold text-slate-900">Akshaya Patra Foundation Hubli</h4>
                            <button 
                                onClick={() => setProfileModal(false)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-900 focus:outline-none"
                            >
                                Close [x]
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Facility Capacity</p>
                                <p className="text-xs font-bold text-slate-950">150 portions daily (120 currently available)</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Volunteers</p>
                                <p className="text-xs font-bold text-slate-950">20 drivers registered on-network</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Accepted Food Types</p>
                                <p className="text-xs font-bold text-slate-950">Cooked Food, Produce, Perishables</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Banner Alerts */}
            {toastMsg && (
                <div className="fixed bottom-6 right-6 bg-[#0B1026] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-xs font-bold tracking-wide animate-pulse">
                    {toastMsg}
                </div>
            )}
        </div>
    );
};

export default AIRecommendations;
