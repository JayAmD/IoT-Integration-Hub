import React, { createContext, useState, useContext } from 'react';
import { tenantApi } from '../api/tenantApi.js';

// 1. Create the context
const TenantContext = createContext(null);

// 2. Create the TenantProvider component
export const TenantProvider = ({ children }) => {
    const [tenants, setTenants] = useState([]);

    // Load all tenants
    const loadTenants = async () => {
        try {
            const tenantList = await tenantApi.list();
            setTenants(tenantList || []);
        } catch (err) {
            console.error("Failed to load tenants:", err);
            throw err;
        }
    };

    // Get a single tenant by ID
    const getTenantById = async (tenantId) => {
        try {
            return await tenantApi.getById(tenantId);
        } catch (err) {
            console.error("Failed to fetch tenant:", err);
            throw err;
        }
    };

    // Add a new tenant
    const addTenant = async (tenantData) => {
        try {
            const newTenant = await tenantApi.create(tenantData);
            setTenants((prev) => [...prev, newTenant]);
            return newTenant;
        } catch (err) {
            console.error("Failed to add tenant:", err);
            throw err;
        }
    };

    // Update an existing tenant
    const updateTenant = async (tenantId, updateData) => {
        try {
            const updatedTenant = await tenantApi.update(tenantId, updateData);
            setTenants((prev) =>
                prev.map((tenant) => (tenant._id === tenantId ? updatedTenant : tenant))
            );
            return updatedTenant;
        } catch (err) {
            console.error("Failed to update tenant:", err);
            throw err;
        }
    };

    // Delete a tenant
    const deleteTenant = async (tenantId) => {
        try {
            await tenantApi.delete(tenantId);
            setTenants((prev) => prev.filter((tenant) => tenant._id !== tenantId));
        } catch (err) {
            console.error("Failed to delete tenant:", err);
            throw err;
        }
    };

    // Add a member to a tenant
    const addMember = async (tenantId, email, role = 'viewer') => {
        try {
            const updatedTenant = await tenantApi.addMember(tenantId, { email, role });
            setTenants((prev) =>
                prev.map((tenant) => (tenant._id === tenantId ? updatedTenant : tenant))
            );
            return updatedTenant;
        } catch (err) {
            console.error("Failed to add member:", err);
            throw err;
        }
    };

    // Remove a member from a tenant
    const removeMember = async (tenantId, userId) => {
        try {
            const updatedTenant = await tenantApi.removeMember(tenantId, userId);
            setTenants((prev) =>
                prev.map((tenant) => (tenant._id === tenantId ? updatedTenant : tenant))
            );
            return updatedTenant;
        } catch (err) {
            console.error("Failed to remove member:", err);
            throw err;
        }
    };

    // Update a member's role
    const updateMemberRole = async (tenantId, userId, role) => {
        try {
            const updatedTenant = await tenantApi.updateMemberRole(tenantId, userId, { role });
            setTenants((prev) =>
                prev.map((tenant) => (tenant._id === tenantId ? updatedTenant : tenant))
            );
            return updatedTenant;
        } catch (err) {
            console.error("Failed to update member role:", err);
            throw err;
        }
    };

    const value = {
        tenants,
        loadTenants,
        getTenantById,
        addTenant,
        updateTenant,
        deleteTenant,
        addMember,
        removeMember,
        updateMemberRole,
    };

    return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useTenantContext = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenantContext must be used within a TenantProvider');
    }
    return context;
};
