import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantApi } from '../api/tenantApi.js';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('authUser');
        return raw ? JSON.parse(raw) : null;
    });
    const [tenants, setTenants] = useState([]);
    const [activeTenantId, setActiveTenantIdState] = useState(() => localStorage.getItem('activeTenantId'));
    const navigate = useNavigate();

    const activeTenant = tenants.find((tenant) => tenant._id === activeTenantId) || null;

    const setActiveTenantId = (tenantId) => {
        if (tenantId) {
            localStorage.setItem('activeTenantId', tenantId);
            setActiveTenantIdState(tenantId);
            return;
        }

        localStorage.removeItem('activeTenantId');
        setActiveTenantIdState(null);
    };

    const bootstrapTenants = async () => {
        const response = await tenantApi.list();
        const tenantList = response?.data || response || [];
        setTenants(tenantList);
        return tenantList;
    };

    // Login handler
    const login = async (newToken, newUser) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);

        if (newUser) {
            localStorage.setItem('authUser', JSON.stringify(newUser));
            setUser(newUser);
        }

        const tenantList = await bootstrapTenants();
        const persistedTenantId = localStorage.getItem('activeTenantId');
        const validPersistedTenant = persistedTenantId
            ? tenantList.find((tenant) => tenant._id === persistedTenantId)
            : null;

        if (validPersistedTenant) {
            setActiveTenantId(validPersistedTenant._id);
            navigate('/devices');
            return;
        }

        if (tenantList.length === 1) {
            setActiveTenantId(tenantList[0]._id);
            navigate('/devices');
            return;
        }

        setActiveTenantId(null);
        navigate('/tenants');
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('activeTenantId');
        setToken(null);
        setUser(null);
        setTenants([]);
        setActiveTenantIdState(null);
        navigate('/login'); // Redirect after logout
    };

    // The value provided to consuming components
    const value = {
        token,
        user,
        tenants,
        activeTenantId,
        activeTenant,
        isLoggedIn: !!token,
        login,
        logout,
        bootstrapTenants,
        setActiveTenantId,
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
