import React, { createContext, useState, useContext, useCallback } from 'react';
import { messageApi } from '../api/messageApi.js';
import { useAuthContext } from './AuthContext.jsx';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
    const { activeTenantId } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filters
    const [filters, setFilters] = useState({
        deviceId: '',
        status: '',
        page: 1,
        limit: 10
    });

    const fetchMessageById = useCallback(async (messageId) => {
        if (!activeTenantId) return null;
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await messageApi.getById(activeTenantId, messageId);
            return data;
        } catch (err) {
            console.error("Failed to fetch message detail:", err);
            setError(err.message || "Failed to load message detail.");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [activeTenantId]);

    const fetchMessages = useCallback(async (overrides = {}) => {
        if (!activeTenantId) return;

        setIsLoading(true);
        setError(null);

        try {
            const params = { ...filters, ...overrides };
            const { items, pagination } = await messageApi.list(activeTenantId, params);
            
            setMessages(items || []);
            if (pagination) {
                setPagination(pagination);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            setError(err.message || "Failed to load messages.");
        } finally {
            setIsLoading(false);
        }
    }, [activeTenantId, filters]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
    };

    const value = {
        messages,
        pagination,
        isLoading,
        error,
        filters,
        updateFilters,
        fetchMessages,
        fetchMessageById
    };

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
};
