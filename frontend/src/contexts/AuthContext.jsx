import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial auth check
        const savedRole = localStorage.getItem('user_role');
        if (savedRole) {
            setUser({
                name: 'Alex Rivera',
                role: savedRole,
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            });
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        const userData = {
            name: 'Alex Rivera',
            role: role,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        };
        setUser(userData);
        localStorage.setItem('user_role', role);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_role');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);