import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, Heart, Loader2, ShieldAlert, Check } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import { getTimeRemaining } from '../../utils/helpers';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('in-stock'); // 'in-stock', 'in-transit', 'distributed'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [distributingId, setDistributingId] = useState(null);
  const [receivingId, setReceivingId] = useState(null);

  const fetchInventory = async () => {
    try {
      const response = await recommendationService.getRecommendations();
      setItems(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load NGO inventory", err);
      setError("Failed to fetch inventory supplies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDistribute = async (donationId) => {
    setDistributingId(donationId);
    setSuccessMsg(null);
    setError(null);
    try {
      await recommendationService.distributeInventory(donationId);
      setSuccessMsg("Supplies successfully logged as Distributed to the community!");
      await fetchInventory();
    } catch (err) {
      console.error("Failed to distribute supplies", err);
      setError(err.response?.data?.detail || "Failed to log distribution.");
    } finally {
      setDistributingId(null);
    }
  };

  const handleReceive = async (donationId) => {
    setReceivingId(donationId);
    setSuccessMsg(null);
    setError(null);
    try {
      await recommendationService.receiveInventory(donationId);
      setSuccessMsg("Supplies successfully marked as Delivered and received into stock!");
      await fetchInventory();
    } catch (err) {
      console.error("Failed to receive supplies", err);
      setError(err.response?.data?.detail || "Failed to mark as received.");
    } finally {
      setReceivingId(null);
    }
  };

  const getFilteredItems = () => {
    return items.filter(item => {
      if (!item.donation) return false;
      const status = item.donation.status;
      if (activeTab === 'in-stock') return status === 'Delivered';
      if (activeTab === 'in-transit') return status === 'Claimed';
      if (activeTab === 'distributed') return status === 'Distributed';
      return false;
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-8 font-sans max-w-5xl text-left">
      <header>
        <h2 className="text-3xl font-display font-bold text-slate-900">NGO Inventory</h2>
        <p className="text-slate-500 mt-1">Manage, verify, and distribute your recovered food supplies to the public.</p>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveTab('in-stock')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'in-stock' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          In Stock ({items.filter(i => i.donation && i.donation.status === 'Delivered').length})
        </button>
        <button
          onClick={() => setActiveTab('in-transit')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'in-transit' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          In Transit ({items.filter(i => i.donation && i.donation.status === 'Claimed').length})
        </button>
        <button
          onClick={() => setActiveTab('distributed')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'distributed' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Distributed ({items.filter(i => i.donation && i.donation.status === 'Distributed').length})
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-slate-100 text-center space-y-4 shadow-sm">
          <Package size={48} className="mx-auto text-slate-200" />
          <p className="text-slate-500 font-medium">No items found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((rec) => (
            <div key={rec.recommendation_id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-200 transition-all">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-100">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{rec.donation.food_type}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5">
                    {activeTab !== 'distributed' && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Shelf Life: {getTimeRemaining(rec.donation.expiry_time)}
                      </span>
                    )}
                    <span className="font-bold text-slate-700">Qty: {rec.donation.quantity} portions</span>
                    <span className="text-slate-400">Source: {rec.donation.pickup_location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                {activeTab === 'in-stock' && (
                  <button
                    onClick={() => handleDistribute(rec.donation_id)}
                    disabled={distributingId === rec.donation_id}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Heart size={14} className="fill-current" />
                    {distributingId === rec.donation_id ? 'Logging...' : 'Distribute to Public'}
                  </button>
                )}

                {activeTab === 'in-transit' && (
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                      <Truck size={14} /> In Transit
                    </span>
                    <button
                      onClick={() => handleReceive(rec.donation_id)}
                      disabled={receivingId === rec.donation_id}
                      className="px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-950 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 focus:outline-none disabled:opacity-50"
                    >
                      {receivingId === rec.donation_id ? 'Receiving...' : 'Mark as Received'}
                    </button>
                  </div>
                )}

                {activeTab === 'distributed' && (
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <Check size={14} /> Distributed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
