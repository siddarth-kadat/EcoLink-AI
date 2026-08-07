import React from "react";
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
                <Route path="/tracking" element={<ProtectedRoute allowedRoles={['restaurant']}><TrackDonation /></ProtectedRoute>} />

                {/* NGO Roles */}
                <Route path="/ngo" element={<ProtectedRoute allowedRoles={['ngo']}><NGODashboard /></ProtectedRoute>} />
                <Route path="/incoming-donations" element={<ProtectedRoute allowedRoles={['ngo']}><IncomingDonations /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute allowedRoles={['ngo']}><Inventory /></ProtectedRoute>} />

                {/* Volunteer Roles */}
                <Route path="/volunteer" element={<ProtectedRoute allowedRoles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute allowedRoles={['volunteer']}><Tasks /></ProtectedRoute>} />
                <Route path="/pickup" element={<ProtectedRoute allowedRoles={['volunteer']}><Pickup /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute allowedRoles={['volunteer']}><Delivery /></ProtectedRoute>} />

                {/* Admin Roles */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />

                {/* Placeholders for settings/support */}
                <Route path="/settings" element={
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
                        <p className="text-slate-500">Configure your profile and system preferences.</p>
                    </div>
                } />
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