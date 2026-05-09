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

    // Bootstrap on mount if logged in
    // This ensures that on page refresh, we immediately fetch the user's tenants
    // so ProtectedRoute can verify the URL and Sidebar can show tenant info.
    React.useEffect(() => {
        if (token) {
            bootstrapTenants();
        }
    }, [token]);

    const setActiveTenantId = (tenantId) => {
        if (tenantId) {
            localStorage.setItem('activeTenantId', tenantId);
            setActiveTenantIdState(tenantId);
        } else {
            localStorage.removeItem('activeTenantId');
            setActiveTenantIdState(null);
        }
    };

    const bootstrapTenants = async () => {
        try {
            const tenantList = await tenantApi.list();
            setTenants(tenantList || []);
            return tenantList;
        } catch (err) {
            console.error("Failed to bootstrap tenants:", err);
            return [];
        }
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
        
        // Find if we have a valid tenant to jump into
        const validTenant = tenantList.find(t => t._id === persistedTenantId) || tenantList[0];

        if (validTenant) {
            setActiveTenantId(validTenant._id);
            navigate(`/tenants/${validTenant._id}/devices`);
        } else {
            navigate('/tenants');
        }
    };

    // Logout handler
    const logout = () => {
        localStorage.clear(); // Clear everything
        setToken(null);
        setUser(null);
        setTenants([]);
        setActiveTenantIdState(null);
        navigate('/login');
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
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
