import React, { createContext, useState, useContext } from 'react';
import { deviceApi } from '../api/deviceApi.js';

const DeviceContext = createContext(null);

export const DeviceProvider = ({ children }) => {
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDevices = async (tenantId) => {
        setIsLoading(true);
        setError(null);
        try {
            const deviceList = await deviceApi.list(tenantId);
            setDevices(deviceList || []);
        } catch (err) {
            console.error("Failed to load devices:", err);
            setError(err.message || 'Failed to load devices');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getDeviceById = async (tenantId, deviceId) => {
        try {
            return await deviceApi.getById(tenantId, deviceId);
        } catch (err) {
            console.error("Failed to fetch device:", err);
            throw err;
        }
    };

    const addDevice = async (tenantId, deviceData) => {
        try {
            const newDevice = await deviceApi.create(tenantId, deviceData);
            setDevices((prev) => [...prev, newDevice]);
            return newDevice;
        } catch (err) {
            console.error("Failed to add device:", err);
            throw err;
        }
    };

    const updateDevice = async (tenantId, deviceId, updateData) => {
        try {
            const updatedDevice = await deviceApi.update(tenantId, deviceId, updateData);
            setDevices((prev) =>
                prev.map((device) => (device._id === deviceId ? updatedDevice : device))
            );
            return updatedDevice;
        } catch (err) {
            console.error("Failed to update device:", err);
            throw err;
        }
    };

    const deleteDevice = async (tenantId, deviceId) => {
        try {
            await deviceApi.delete(tenantId, deviceId);
            setDevices((prev) => prev.filter((device) => device._id !== deviceId));
        } catch (err) {
            console.error("Failed to delete device:", err);
            throw err;
        }
    };

    const value = {
        devices,
        isLoading,
        error,
        fetchDevices,
        getDeviceById,
        addDevice,
        updateDevice,
        deleteDevice,
    };

    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDeviceContext = () => {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error('useDeviceContext must be used within a DeviceProvider');
    }
    return context;
};
