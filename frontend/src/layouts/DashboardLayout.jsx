import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import TopBar from '../components/navigation/TopBar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-surface">
            <Sidebar />
            <div className="pl-0 lg:pl-64 flex flex-col min-h-screen">
                <TopBar />
                <main className="flex-1 p-10 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </main>
                <footer className="px-10 py-6 text-center text-slate-400 text-xs border-t border-slate-50">
                    © 2024 EcoLink AI. Precision Food Recovery. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;