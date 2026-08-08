import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

import LandingPage from "../pages/Landing/LandingPage";
import RoleSelection from "../pages/Auth/RoleSelection";
import Login from "../pages/Auth/Login";

import RestaurantDashboard from "../pages/Restaurant/Dashboard";
import CreateDonation from "../pages/Restaurant/CreateDonation";
import AIRecommendations from "../pages/Restaurant/AIRecommendations";
import DonationHistory from "../pages/Restaurant/DonationHistory";
import TrackDonation from "../pages/Restaurant/TrackDonation";

import NGODashboard from "../pages/NGO/Dashboard";
import IncomingDonations from "../pages/NGO/IncomingDonations";
import Inventory from "../pages/NGO/Inventory";

import VolunteerDashboard from "../pages/Volunteer/Dashboard";
import Tasks from "../pages/Volunteer/Tasks";
import Pickup from "../pages/Volunteer/Pickup";
import Delivery from "../pages/Volunteer/Delivery";

import AdminDashboard from "../pages/Admin/Dashboard";
import AdminAnalytics from "../pages/Admin/Analytics";

import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

// Redirect to role-specific dashboard path
const ProfilePage = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-6 text-left font-sans">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm max-w-2xl space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-900">{user?.name || 'Demo User'}</h4>
                        <p className="text-xs text-slate-505 font-bold uppercase tracking-wider">{user?.role || 'Guest'}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-xs">
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Email Address</p>
                        <p className="text-slate-900 font-semibold mt-1.5">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Account Role</p>
                        <p className="text-slate-900 font-semibold mt-1.5">{user?.role || 'None'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [aiAlerts, setAiAlerts] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);

    const handleSave = (e) => {
        e.preventDefault();
        updateUser({ name, email, address });
        setToastMessage("Settings saved successfully!");
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="space-y-6 text-left font-sans relative">
            {toastMessage && (
                <div className="fixed bottom-6 right-6 bg-[#0B1026] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 text-xs font-bold tracking-wide animate-pulse">
                    {toastMessage}
                </div>
            )}
            
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Configure your profile and system preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Profile Form (Span 8) */}
                <form onSubmit={handleSave} className="lg:col-span-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Account Profile</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-slate-900/10 text-slate-800 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-semibold focus:ring-2 focus:ring-slate-900/10 text-slate-800 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">User Role</label>
                            <input 
                                type="text"
                                value={user?.role || 'Guest'}
                                className="w-full bg-slate-100 border-none rounded-xl py-3 px-4 text-xs font-semibold text-slate-400 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        {user?.role?.toLowerCase() === 'restaurant' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Restaurant Address</label>
                                <input 
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Vidya Nagar, Hubballi, Karnataka, India"
                                    className="w-full bg-slate-50 border-none rounded-xl py-3.5 px-4 text-xs font-semibold focus:ring-2 focus:ring-slate-900/10 text-slate-800 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit"
                        className="px-6 py-3 bg-[#0B1026] text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm focus:outline-none"
                    >
                        Save Settings
                    </button>
                </form>

                {/* System Toggles (Span 4) */}
                <div className="lg:col-span-4 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">System Preferences</h4>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                                <p className="text-[9px] text-slate-450 mt-0.5">Receive delivery updates</p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900/10 border-slate-200"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-800">AI Match Alerts</p>
                                <p className="text-[9px] text-slate-450 mt-0.5">Alert on high match compatibility</p>
                            </div>
                            <input 
                                type="checkbox"
                                checked={aiAlerts}
                                onChange={() => setAiAlerts(!aiAlerts)}
                                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900/10 border-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    const role = user.role.toLowerCase();
    return <Navigate to={`/${role}`} replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* ================= Public Routes ================= */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
            </Route>

            {/* ================= Auth Routes ================= */}
            <Route element={<AuthLayout />}>
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/login" element={<Login />} />
            </Route>

            {/* ================= Protected Dashboard Routes ================= */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Restaurant Roles */}
                <Route path="/restaurant" element={<ProtectedRoute allowedRoles={['restaurant']}><RestaurantDashboard /></ProtectedRoute>} />
                <Route path="/create-donation" element={<ProtectedRoute allowedRoles={['restaurant']}><CreateDonation /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute allowedRoles={['restaurant']}><AIRecommendations /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute allowedRoles={['restaurant']}><DonationHistory /></ProtectedRoute>} />
                <Route path="/tracking" element={<ProtectedRoute allowedRoles={['restaurant', 'volunteer']}><TrackDonation /></ProtectedRoute>} />

                {/* NGO Roles */}
                <Route path="/ngo" element={<ProtectedRoute allowedRoles={['ngo']}><NGODashboard /></ProtectedRoute>} />
                <Route path="/incoming-donations" element={<ProtectedRoute allowedRoles={['ngo']}><IncomingDonations /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute allowedRoles={['ngo']}><Inventory /></ProtectedRoute>} />

                {/* Volunteer Roles */}
                <Route path="/volunteer" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
                <Route path="/pickup" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />

                {/* Admin Roles */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />

                {/* Placeholders for settings/support */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Support</h2>
                        <p className="text-slate-500">Access support channels and documentation guides.</p>
                    </div>
                } />
            </Route>

            {/* ================= Fallback 404 ================= */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;