import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, CheckCircle2, User, Loader2, ShieldAlert } from 'lucide-react';
import { donationService } from '../../services/donationService';
import LeafletMap from '../../components/maps/LeafletMap';

const TrackDonation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const donationId = location.state?.donationId;

  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    const role = localStorage.getItem('user_role');
    if (role === 'volunteer') {
      navigate('/volunteer');
    } else {
      navigate('/history');
    }
  };

  useEffect(() => {
    const fetchTracking = async () => {
      let activeId = donationId;

      if (!activeId) {
        try {
          const historyRes = await donationService.getDonationHistory();
          if (historyRes.data && historyRes.data.length > 0) {
            const sorted = historyRes.data.sort((a, b) => b.id - a.id);
            activeId = sorted[0].id;
          }
        } catch (err) {
          console.error("Failed to load history for auto-tracking", err);
        }
      }

      if (!activeId) {
        setError("No active donation selected for tracking.");
        setLoading(false);
        return;
      }

      try {
        const response = await donationService.trackDonation(activeId);
        setTrackData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load tracking data", err);
        setError("Failed to fetch real-time tracking logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
    const interval = setInterval(fetchTracking, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [donationId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !trackData) {
    return (
      <div className="space-y-6 max-w-md mx-auto text-center py-20 font-sans">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
        <h3 className="text-xl font-bold text-slate-900">Tracking Unavailable</h3>
        <p className="text-slate-500 text-sm">{error || "Could not retrieve tracker status."}</p>
        <button onClick={handleBack} className="px-6 py-2.5 bg-slate-950 text-white rounded-xl font-bold text-xs">
          Return to History
        </button>
      </div>
    );
  }

  // Calculate delivery stage
  let currentStage = 1; // 1: Created, 2: Claimed by NGO, 3: Volunteer Assigned, 4: Picked Up, 5: Delivered
  if (trackData.status === 'Delivered') {
    currentStage = 5;
  } else if (trackData.status === 'Picked Up' || trackData.delivery?.pickup_status === 'Picked Up') {
    currentStage = 4;
  } else if (trackData.delivery?.volunteer_id) {
    currentStage = 3;
  } else if (trackData.status === 'Claimed') {
    currentStage = 2;
  }

  const stages = [
    { label: 'Donation Posted', desc: 'Surplus food made available' },
    { label: 'NGO Matched', desc: 'NGO accepted & claiming items' },
    { label: 'Volunteer Assigned', desc: 'Courier route established' },
    { label: 'Food Collected', desc: 'In transit to target NGO' },
    { label: 'Delivered', desc: 'Successfully handed off' }
  ];

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to History
      </button>

      <header>
        <h2 className="text-3xl font-display font-bold text-slate-900">{trackData.food_type}</h2>
        <p className="text-slate-500 mt-1">Quantity: {trackData.quantity} portions • ID: #{trackData.id}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
          <h4 className="text-xl font-bold text-slate-900 mb-6">Delivery Progress</h4>

          <div className="relative pl-10 space-y-12 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {stages.map((stage, i) => {
              const stepNum = i + 1;
              const isCompleted = currentStage >= stepNum;
              const isCurrent = currentStage === stepNum;
              
              return (
                <div key={i} className="relative flex gap-6">
                  <div className={`absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    isCompleted ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted && currentStage > stepNum ? <CheckCircle2 size={16} /> : stepNum}
                  </div>
                  <div>
                    <h5 className={`font-bold ${isCurrent ? 'text-slate-950 text-lg' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>{stage.label}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-50 p-8 rounded-[40px] border border-slate-200/50 space-y-6">
          <h4 className="font-bold text-slate-900">Dispatch Details</h4>

          <div className="h-80 relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white">
            <LeafletMap 
              pickupLoc={trackData.pickup_location}
              deliveryLoc={trackData.destination || 'Hope Mission'}
              courierStatus={trackData.status}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
              <MapPin className="text-slate-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pickup Location</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{trackData.pickup_location}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
              <Package className="text-slate-400 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Courier Status</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  {trackData.delivery?.pickup_status === 'Picked Up' ? 'En Route to NGO' : 'Awaiting Courier'}
                </p>
              </div>
            </div>

            {trackData.delivery && (
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                <User className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Assigned Volunteer</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {trackData.delivery.volunteer_id ? `Volunteer #${trackData.delivery.volunteer_id}` : 'Unassigned'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDonation;
