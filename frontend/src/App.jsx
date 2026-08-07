import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import './index.css';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RoleProvider>
                    <AppRoutes />
                </RoleProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;