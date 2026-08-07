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
        className={`flex-1 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${selected ? 'bg-white border-slate-900 shadow-xl scale-105' : 'bg-white border-slate-50 hover:border-slate-200'}`}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
            <Icon size={24} />
        </div>
        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{label}</span>
    </button>
);

const CreateDonation = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('Prepared Meals');
    const [weight, setWeight] = useState('');
    const [expiry, setExpiry] = useState('');
    const [description, setDescription] = useState('');
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { category, weight, expiry, description };
            await donationService.createDonation(payload);
            navigate('/dashboard');
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Form Column */}
                <div className="lg:col-span-8 bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <StepIndicator currentStep={step} />

                    <div className="space-y-12">
                        <section>
                            <h4 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                {step}. Item Details
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
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
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
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
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
                                        className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-center">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-50">
                            {submitting ? 'Creating...' : 'Create Donation'} <ArrowRight size={18} />
                        </button>
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
                                    <div key={match.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group cursor-pointer hover:border-primary/20 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                                                <Zap size={18} />
                                            </div>
                                            <div className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-bold rounded uppercase tracking-tighter">
                                                {match.score}% Match
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

                    <div className="p-8 bg-primary text-white rounded-[40px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h5 className="font-bold mb-2 flex items-center gap-2">
                                <Info size={16} /> Pro Tip
                            </h5>
                            <p className="text-white/70 text-xs leading-relaxed">
                                Adding clear photos of the items increases donation claim rates by 40%.
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateDonation;
