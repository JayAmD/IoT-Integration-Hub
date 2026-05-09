import React, { createContext, useState, useContext, useCallback } from 'react';
import { endpointApi } from '../api/endpointApi.js';

const EndpointContext = createContext(null);

export const EndpointProvider = ({ children }) => {
    const [endpoints, setEndpoints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadEndpoints = useCallback(async (tenantId) => {
        if (!tenantId) return;
        
        setIsLoading(true);
        try {
            const data = await endpointApi.list(tenantId);
            setEndpoints(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load endpoints');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getEndpointDetail = async (tenantId, id) => {
        return await endpointApi.getById(tenantId, id);
    };

    const addEndpoint = async (tenantId, data) => {
        const newEndpoint = await endpointApi.create(tenantId, data);
        setEndpoints(prev => [...prev, newEndpoint]);
        return newEndpoint;
    };

    const updateEndpoint = async (tenantId, id, data) => {
        const updatedEndpoint = await endpointApi.update(tenantId, id, data);
        setEndpoints(prev => prev.map(e => e._id === id ? updatedEndpoint : e));
        return updatedEndpoint;
    };

    const deleteEndpoint = async (tenantId, id) => {
        await endpointApi.delete(tenantId, id);
        setEndpoints(prev => prev.filter(e => e._id !== id));
    };

    const value = {
        endpoints,
        isLoading,
        error,
        loadEndpoints,
        getEndpointDetail,
        addEndpoint,
        updateEndpoint,
        deleteEndpoint
    };

    return <EndpointContext.Provider value={value}>{children}</EndpointContext.Provider>;
};

export const useEndpointContext = () => {
    const context = useContext(EndpointContext);
    if (!context) {
        throw new Error('useEndpointContext must be used within an EndpointProvider');
    }
    return context;
};
