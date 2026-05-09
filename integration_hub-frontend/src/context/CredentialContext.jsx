import React, { createContext, useState, useContext, useCallback } from 'react';
import { credentialApi } from '../api/credentialApi.js';
import { useAuthContext } from './AuthContext.jsx';

const CredentialContext = createContext(null);

export const CredentialProvider = ({ children }) => {
    const { activeTenantId } = useAuthContext();
    const [credentials, setCredentials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCredentials = useCallback(async () => {
        if (!activeTenantId) return;
        setIsLoading(true);
        try {
            const response = await credentialApi.list(activeTenantId);
            setCredentials(response?.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load credentials');
        } finally {
            setIsLoading(false);
        }
    }, [activeTenantId]);

    const addCredential = async (data) => {
        const response = await credentialApi.create(activeTenantId, data);
        setCredentials(prev => [...prev, response.data || response]);
        return response.data || response;
    };

    const updateCredential = async (id, data) => {
        const response = await credentialApi.update(activeTenantId, id, data);
        setCredentials(prev => prev.map(c => c._id === id ? (response.data || response) : c));
        return response.data || response;
    };

    const deleteCredential = async (id) => {
        await credentialApi.delete(activeTenantId, id);
        setCredentials(prev => prev.filter(c => c._id !== id));
    };

    const value = {
        credentials,
        isLoading,
        error,
        loadCredentials,
        addCredential,
        updateCredential,
        deleteCredential
    };

    return <CredentialContext.Provider value={value}>{children}</CredentialContext.Provider>;
};

export const useCredentialContext = () => {
    const context = useContext(CredentialContext);
    if (!context) {
        throw new Error('useCredentialContext must be used within a CredentialProvider');
    }
    return context;
};
