import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Car,
    Clock,
    MapPin,
    CheckCircle2,
    ArrowRight,
    ChevronRight,
    Info,
    Sparkles,
    Zap
} from 'lucide-react';
import { donationService } from '../../services/donationService';
import { recommendationService } from '../../services/recommendationService';
import { useAuth } from '../../contexts/AuthContext';

const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center gap-4 mb-16">
        {[
            { step: 1, label: 'Details' },
            { step: 2, label: 'Storage' },
            { step: 3, label: 'Schedule' }
        ].map((s, i) => (
            <React.Fragment key={s.step}>
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= s.step ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-400'}`}>
                        {currentStep > s.step ? <CheckCircle2 size={16} /> : s.step}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${currentStep >= s.step ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-12 h-px bg-slate-200 mx-2" />}
            </React.Fragment>
        ))}
    </div>
);

const CategoryCard = ({ icon: Icon, label, selected, onClick }) => (
    <button
        onClick={onClick}
        type="button"
        className={`flex-1 p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${selected ? 'bg-white border-slate-900 shadow-md' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            <Icon size={20} />
        </div>
        <span className="text-[10px] font-bold text-slate-950 uppercase tracking-wider">{label}</span>
    </button>
);

const CreateDonation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('Prepared Meals');
    const [weight, setWeight] = useState('');
    const [expiry, setExpiry] = useState('');
    const [description, setDescription] = useState('');

    // Step 2 & 3 custom wizard states
    const [storageTemp, setStorageTemp] = useState('Room Temp');
    const [packaging, setPackaging] = useState('Boxes');
    const [pickupStart, setPickupStart] = useState('14:00');
    const [pickupEnd, setPickupEnd] = useState('18:00');
    const [contactName, setContactName] = useState('Alex Rivera');
    const [contactPhone, setContactPhone] = useState('+1 (555) 019-2834');
    const [pickupLocation, setPickupLocation] = useState(user?.address || 'Vidya Nagar, Hubballi, Karnataka, India');

    useEffect(() => {
        if (user?.address) {
            setPickupLocation(user.address);
        }
    }, [user?.address]);

    // Selection & toast interaction states
    const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [toastMsg, setToastMsg] = useState(null);

    const triggerToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 4000);
    };
    
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoadingMatches(true);
            try {
                const response = await recommendationService.getRecommendations();
                setMatches(response.data);
            } catch (err) {
                console.error("Failed to load recommendation matches", err);
            } finally {
                setLoadingMatches(false);
            }
        };
        fetchMatches();
    }, [category]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = { 
                category, 
                weight, 
                expiry, 
                description,
                storage_temp: storageTemp,
                packaging_type: packaging,
                pickup_start: pickupStart,
                pickup_end: pickupEnd,
                contact_name: contactName,
                contact_phone: contactPhone,
                pickup_location: pickupLocation || user?.address || 'Vidya Nagar, Hubballi, Karnataka, India',
                recipient_id: selectedMatchId,
                locked_recipient: selectedMatchId ? matches.find(m => m.id === selectedMatchId)?.title : null
            };
            await donationService.createDonation(payload);
            navigate('/restaurant');
        } catch (err) {
            console.error("Failed to submit donation", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-display font-bold text-slate-900">Create Donation</h2>
                <p className="text-slate-500 mt-2 text-lg">Enter details to match your surplus food with the right recipient.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Form Column */}
                <div className="lg:col-span-8 bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <StepIndicator currentStep={step} />

                    <div className="space-y-12">
                        {/* Step 1: Item Details */}
                        {step === 1 && (
                            <section>
                                <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    1. Item Details
                                </h4>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Food Category</label>
                                        <div className="flex gap-4">
                                            <CategoryCard icon={Package} label="Prepared Meals" selected={category === 'Prepared Meals'} onClick={() => setCategory('Prepared Meals')} />
                                            <CategoryCard icon={Zap} label="Produce" selected={category === 'Produce'} onClick={() => setCategory('Produce')} />
                                            <CategoryCard icon={Package} label="Bakery" selected={category === 'Bakery'} onClick={() => setCategory('Bakery')} />
                                            <CategoryCard icon={Package} label="Packaged" selected={category === 'Packaged'} onClick={() => setCategory('Packaged')} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="weight" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Estimated Weight (kg)</label>
                                            <input
                                                id="weight"
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="25"
                                                required
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="expiry" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Expiry Date & Time</label>
                                            <input
                                                id="expiry"
                                                type="datetime-local"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                required
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Description (Optional)</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="E.g., Assorted sandwiches and salads from lunch service."
                                            className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-h-[120px] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Step 2: Storage Requirements */}
                        {step === 2 && (
                            <section>
                                <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    2. Storage Requirements
                                </h4>

                                <div className="space-y-8 text-left">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Temperature Control</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Room Temp', 'Refrigerated', 'Frozen'].map((temp) => (
                                                <button
                                                    key={temp}
                                                    type="button"
                                                    onClick={() => setStorageTemp(temp)}
                                                    className={`p-4 rounded-xl border text-xs font-bold transition-all focus:outline-none ${storageTemp === temp ? 'bg-[#0B1026] text-white border-[#0B1026] shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-700'}`}
                                                >
                                                    {temp}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Packaging Type</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Boxes', 'Bags', 'Containers', 'Trays'].map((pack) => (
                                                <button
                                                    key={pack}
                                                    type="button"
                                                    onClick={() => setPackaging(pack)}
                                                    className={`p-4 rounded-xl border text-[10px] font-bold transition-all focus:outline-none ${packaging === pack ? 'bg-[#0B1026] text-white border-[#0B1026] shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200 text-slate-750'}`}
                                                >
                                                    {pack}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Step 3: Pickup Schedule */}
                        {step === 3 && (
                            <section>
                                <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    3. Pickup Schedule
                                </h4>

                                <div className="space-y-8 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Available From</label>
                                            <input
                                                type="time"
                                                value={pickupStart}
                                                onChange={(e) => setPickupStart(e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Available Until</label>
                                            <input
                                                type="time"
                                                value={pickupEnd}
                                                onChange={(e) => setPickupEnd(e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Contact Person</label>
                                            <input
                                                type="text"
                                                placeholder="Alex Rivera"
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Contact Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+1 (555) 019-2834"
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Pickup Location Address (Defaults to Restaurant Profile Address)</label>
                                        <input
                                            type="text"
                                            placeholder="Vidya Nagar, Hubballi, Karnataka, India"
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none text-slate-800"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-center">
                        {step > 1 ? (
                            <button 
                                type="button" 
                                onClick={() => setStep(step - 1)} 
                                className="px-8 py-3.5 border border-slate-200 text-slate-650 rounded-xl font-bold hover:bg-slate-50 transition-colors text-xs focus:outline-none"
                            >
                                Back
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => navigate('/restaurant')} 
                                className="px-8 py-3.5 border border-slate-200 text-slate-650 rounded-xl font-bold hover:bg-slate-50 transition-colors text-xs focus:outline-none"
                            >
                                Save Draft
                            </button>
                        )}

                        {step < 3 ? (
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (step === 1 && (!weight || !expiry)) {
                                        alert("Please enter both estimated weight and expiry details.");
                                        return;
                                    }
                                    setStep(step + 1);
                                }}
                                className="px-8 py-3.5 bg-[#0B1026] text-white rounded-xl font-bold hover:bg-slate-850 transition-all flex items-center gap-2 shadow-sm text-xs focus:outline-none"
                            >
                                Next Step <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                onClick={handleSubmit}
                                disabled={submitting} 
                                className="px-8 py-3.5 bg-[#0B1026] text-white rounded-xl font-bold hover:bg-slate-850 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 text-xs focus:outline-none"
                            >
                                {submitting ? 'Creating...' : 'Submit Donation'} <CheckCircle2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* AI Sidebar Column */}
                <div className="lg:col-span-4 space-y-6 sticky top-28">
                    <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <Sparkles className="text-primary" size={24} />
                            <h4 className="text-xl font-bold text-slate-900">LIVE AI MATCH</h4>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed mb-8 font-medium">
                            Based on your input, our AI is predicting the best recipients for this donation.
                        </p>

                        <div className="space-y-4">
                            {loadingMatches ? (
                                <div className="py-4 text-center text-xs text-slate-400">Finding matches...</div>
                            ) : (
                                matches.map((match) => (
                                    <div 
                                        key={match.id} 
                                        onClick={() => {
                                            const isSelected = selectedMatchId === match.id;
                                            setSelectedMatchId(isSelected ? null : match.id);
                                            triggerToast(isSelected ? "AI Auto-Route Unlocked." : `AI Auto-Route Locked: ${match.title} selected as recipient.`);
                                        }}
                                        className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
                                            selectedMatchId === match.id 
                                                ? 'border-emerald-500 ring-2 ring-emerald-550/10' 
                                                : 'border-slate-100 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                                                <Zap size={18} />
                                            </div>
                                            <div className="flex gap-1.5 items-center">
                                                {selectedMatchId === match.id && (
                                                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded uppercase tracking-tighter">
                                                        LOCKED
                                                    </span>
                                                )}
                                                <div className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-bold rounded uppercase tracking-tighter">
                                                    {match.score}% Match
                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="text-sm font-bold text-slate-900 mb-1">{match.title}</h5>
                                        <p className="text-xs text-slate-500 font-medium">Needs {category.toLowerCase()} today. {match.distance} miles away.</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-slate-400">
                            <div className="w-2 h-2 bg-slate-200 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Analyzing storage requirements...</span>
                        </div>
                    </div>
                </div>
            </div>

            {toastMsg && (
                <div className="fixed bottom-6 right-6 bg-[#0B1026] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-xs font-bold tracking-wide animate-pulse">
                    {toastMsg}
                </div>
            )}
        </div>
    );
};

export default CreateDonation;
