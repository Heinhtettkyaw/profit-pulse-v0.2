import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const tokenFromStorage = localStorage.getItem('token');
    const roleFromStorage = localStorage.getItem('role');

    const [auth, setAuth] = useState({
        token: tokenFromStorage || null,
        role: roleFromStorage || null,
        isAuthenticated: !!tokenFromStorage,
    });

    const loginUser = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setAuth({ token, role, isAuthenticated: true });
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth({ token: null, role: null, isAuthenticated: false });
    };

    return (
        <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
