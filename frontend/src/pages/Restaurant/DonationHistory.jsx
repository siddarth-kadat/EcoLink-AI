import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Clock, Navigation } from 'lucide-react';
import { donationService } from '../../services/donationService';
import { getTimeRemaining } from '../../utils/helpers';

const DonationHistory = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await donationService.getDonationHistory();
        setDonations(response.data);
      } catch (err) {
        console.error("Failed to load donation history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Donation History</h2>
          <p className="text-slate-500 mt-1">Review your surplus food rescue contributions.</p>
        </div>
        <button onClick={() => navigate('/create-donation')} className="btn-primary shadow-lg shadow-primary/20">
          New Donation
        </button>
      </header>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {donations.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <Package size={48} className="mx-auto text-slate-300 animate-pulse" />
            <p className="text-slate-500 font-medium">No donation contributions recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {donations.map((d) => (
              <div key={d.donation_id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-100">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{d.food_type}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> Expiry: {getTimeRemaining(d.expiry_time)}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> Logged: {new Date(d.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-bold text-slate-700">Qty: {d.quantity} servings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-auto">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    d.status === 'Available' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    d.status === 'Claimed' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {d.status}
                  </span>
                  
                  {d.status === 'Claimed' && (
                    <button
                      onClick={() => navigate('/tracking', { state: { donationId: d.donation_id } })}
                      className="px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Navigation size={12} /> Track Route
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
