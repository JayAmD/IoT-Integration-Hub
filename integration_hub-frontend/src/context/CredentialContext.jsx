import React, { createContext, useState, useContext, useCallback } from 'react';
import { credentialApi } from '../api/credentialApi.js';
import { useAuthContext } from './AuthContext.jsx';

const CredentialContext = createContext(null);

export const CredentialProvider = ({ children }) => {
    const { activeTenantId: contextTenantId } = useAuthContext();
    const [credentials, setCredentials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCredentials = useCallback(async (tenantId) => {
        const targetId = tenantId || contextTenantId;
        if (!targetId) return;
        
        setIsLoading(true);
        try {
            const data = await credentialApi.list(targetId);
            setCredentials(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load credentials');
        } finally {
            setIsLoading(false);
        }
    }, [contextTenantId]);

    const getCredentialDetail = async (tenantId, id) => {
        const targetId = tenantId || contextTenantId;
        return await credentialApi.getById(targetId, id);
    };

    const addCredential = async (tenantId, data) => {
        const targetId = tenantId || contextTenantId;
        const newCred = await credentialApi.create(targetId, data);
        setCredentials(prev => [...prev, newCred]);
        return newCred;
    };

    const updateCredential = async (tenantId, id, data) => {
        const targetId = tenantId || contextTenantId;
        const updatedCred = await credentialApi.update(targetId, id, data);
        setCredentials(prev => prev.map(c => c._id === id ? updatedCred : c));
        return updatedCred;
    };

    const deleteCredential = async (tenantId, id) => {
        const targetId = tenantId || contextTenantId;
        await credentialApi.delete(targetId, id);
        setCredentials(prev => prev.filter(c => c._id !== id));
    };

    const revealSecret = async (tenantId, id) => {
        const targetId = tenantId || contextTenantId;
        const data = await credentialApi.reveal(targetId, id);
        return data.secret;
    };

    const value = {
        credentials,
        isLoading,
        error,
        loadCredentials,
        getCredentialDetail,
        addCredential,
        updateCredential,
        deleteCredential,
        revealSecret
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
