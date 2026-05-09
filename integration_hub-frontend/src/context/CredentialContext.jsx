import React, { createContext, useState, useContext, useCallback } from 'react';
import { credentialApi } from '../api/credentialApi.js';

const CredentialContext = createContext(null);

export const CredentialProvider = ({ children }) => {
    const [credentials, setCredentials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCredentials = useCallback(async (tenantId) => {
        if (!tenantId) return;
        
        setIsLoading(true);
        try {
            const data = await credentialApi.list(tenantId);
            setCredentials(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load credentials');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCredentialDetail = async (tenantId, id) => {
        return await credentialApi.getById(tenantId, id);
    };

    const addCredential = async (tenantId, data) => {
        const newCred = await credentialApi.create(tenantId, data);
        setCredentials(prev => [...prev, newCred]);
        return newCred;
    };

    const updateCredential = async (tenantId, id, data) => {
        const updatedCred = await credentialApi.update(tenantId, id, data);
        setCredentials(prev => prev.map(c => c._id === id ? updatedCred : c));
        return updatedCred;
    };

    const deleteCredential = async (tenantId, id) => {
        await credentialApi.delete(tenantId, id);
        setCredentials(prev => prev.filter(c => c._id !== id));
    };

    const revealSecret = async (tenantId, id) => {
        const secret = await credentialApi.reveal(tenantId, id);
        return secret;
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
