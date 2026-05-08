import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const navigate = useNavigate();

    // Login handler
    const login = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        navigate('/devices'); // Redirect after login
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        navigate('/login'); // Redirect after logout
    };

    // The value provided to consuming components
    const value = {
        token,
        isLoggedIn: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
