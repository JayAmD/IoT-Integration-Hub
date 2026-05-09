import React, { createContext, useState, useContext } from 'react';
import { groupApi } from '../api/groupApi.js';

// 1. Create the context
const GroupContext = createContext(null);

// 2. Create the GroupProvider component
export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);

    // Load all groups
    const loadGroups = async (tenantId) => {
        try {
            const groupList = await groupApi.list(tenantId);
            setGroups(groupList || []);
        } catch (err) {
            console.error("Failed to load groups:", err);
            throw err;
        }
    };

    // Add a new group
    const addGroup = async (tenantId, name) => {
        try {
            const newGroup = await groupApi.create(tenantId, { name });
            setGroups((prev) => [...prev, newGroup]);
            return newGroup;
        } catch (err) {
            console.error("Failed to add group:", err);
            throw err;
        }
    };

    // Update an existing group
    const updateGroup = async (tenantId, id, updateData) => {
        try {
            const updatedGroup = await groupApi.update(tenantId, id, updateData);
            setGroups((prev) =>
                prev.map((group) => (group._id === id ? updatedGroup : group))
            );
            return updatedGroup;
        } catch (err) {
            console.error("Failed to update group:", err);
            throw err;
        }
    };

    // Delete a group
    const deleteGroup = async (tenantId, id) => {
        try {
            await groupApi.delete(tenantId, id);
            setGroups((prev) => prev.filter((group) => group._id !== id));
        } catch (err) {
            console.error("Failed to delete group:", err);
            throw err;
        }
    };

    const value = {
        groups,
        loadGroups,
        addGroup,
        updateGroup,
        deleteGroup,
    };

    return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useGroupsContext = () => {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error('useGroupsContext must be used within a GroupProvider');
    }
    return context;
};
