import React, { useState, useEffect } from 'react';
import { Inbox, Clock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import { getTimeRemaining, getScoreColor } from '../../utils/helpers';

const IncomingDonations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const response = await recommendationService.getRecommendations();
      setRecommendations(response.data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
      setError("Failed to fetch matched recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAccept = async (recId) => {
    setAcceptingId(recId);
    setSuccessMsg(null);
    setError(null);
    try {
      await recommendationService.acceptRecommendation(recId);
      setSuccessMsg("Recommendation accepted successfully! A delivery task has been created for dispatch.");
      await fetchRecommendations();
    } catch (err) {
      console.error("Failed to accept recommendation", err);
      setError(err.response?.data?.detail || "Failed to claim recommendation.");
    } finally {
      setAcceptingId(null);
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
    <div className="space-y-8 font-sans max-w-5xl">
      <header>
        <h2 className="text-3xl font-display font-bold text-slate-900">Incoming Recommendations</h2>
        <p className="text-slate-500 mt-1">AI-calculated compatibility matches for food surplus in Hubballi.</p>
      </header>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {recommendations.filter(rec => rec.donation && rec.donation.status === 'Available').length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center space-y-4 shadow-sm">
          <Inbox size={48} className="mx-auto text-slate-200" />
          <p className="text-slate-500 font-medium">No matches calculated for your inventory settings today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.filter(rec => rec.donation && rec.donation.status === 'Available').map((rec) => {
            const matchPercent = Math.round(rec.confidence_score * 100);
            const priorityPercent = Math.round(rec.priority_score * 100);
            
            return (
              <div key={rec.recommendation_id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between gap-8 hover:border-slate-200 transition-all">
                <div className="space-y-6 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} /> {matchPercent}% Match Score
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <Clock size={12} /> {getTimeRemaining(rec.donation.expiry_time)} remaining
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{rec.donation.food_type}</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Location: {rec.donation.pickup_location} • Qty: {rec.donation.quantity} servings</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Confidence</p>
                      <p className={`text-sm font-bold mt-1 ${getScoreColor(matchPercent)}`}>{matchPercent}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Priority</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{priorityPercent}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Transit Risk</p>
                      <p className={`text-sm font-bold mt-1 ${rec.delivery_risk === 'Low' ? 'text-emerald-600' : rec.delivery_risk === 'Medium' ? 'text-orange-600' : 'text-rose-600'}`}>
                        {rec.delivery_risk}
                      </p>
                    </div>
                  </div>

                  {rec.recommendation_explanation && (
                    <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                      💡 {rec.recommendation_explanation}
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-between items-end gap-6 shrink-0 lg:border-l lg:border-slate-50 lg:pl-8">
                  <div className="text-right hidden lg:block">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recommended Route</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Available for immediate claiming</p>
                  </div>
                  
                  <button
                    onClick={() => handleAccept(rec.recommendation_id)}
                    disabled={acceptingId === rec.recommendation_id}
                    className="w-full lg:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-950/10 disabled:opacity-50 text-sm"
                  >
                    {acceptingId === rec.recommendation_id ? 'Claiming...' : 'Accept & Route'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncomingDonations;
