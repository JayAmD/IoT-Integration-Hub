import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useDeviceContext } from "../context/DeviceContext.jsx";
import { useGroupContext } from "../context/GroupContext.jsx";

import DeviceDetailHeader from "../components/device/DeviceDetailHeader.jsx";
import DeviceDetailCard from "../components/device/DeviceDetailCard.jsx";

export default function DeviceDetail() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { activeTenantId } = useAuthContext();
  const { getDeviceById, updateDevice, deleteDevice } = useDeviceContext();
  const { groups: availableGroups, loadGroups } = useGroupContext();
  
  // Local Orchestration State
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    claimToken: '',
    groupIds: [],
  });

  // Load device and groups data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!activeTenantId) return;

      setIsLoading(true);
      try {
        // Fetch groups and the specific device in parallel
        const [deviceData] = await Promise.all([
          getDeviceById(activeTenantId, deviceId),
          loadGroups(activeTenantId)
        ]);

        setDevice(deviceData);
        setFormData({
          name: deviceData.name || '',
          claimToken: deviceData.claimToken || '',
          groupIds: deviceData.groups ? deviceData.groups.map(g => g._id) : [],
        });
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [deviceId, activeTenantId]);

  const handleEditClick = () => {
    setIsEditMode(true);
    setFormData({
      name: device.name || '',
      claimToken: device.claimToken || '',
      groupIds: device.groups ? device.groups.map(g => g._id) : [],
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupChange = (event) => {
    const { target: { value } } = event;
    setFormData(prev => ({
      ...prev,
      groupIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const updatedData = await updateDevice(activeTenantId, deviceId, {
        name: formData.name,
        claimToken: formData.claimToken,
        groupIds: formData.groupIds
      });
      setDevice(updatedData);
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save device", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      setIsDeleting(true);
      try {
        await deleteDevice(activeTenantId, deviceId);
        navigate(`/tenants/${activeTenantId}/devices`);
      } catch (error) {
        console.error("Failed to delete device", error);
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.50' }}>
        <CircularProgress size={40} thickness={4} sx={{ color: 'primary.light' }} />
      </Box>
    );
  }

  if (!device) {
    return (
      <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
        <Typography>Device not found.</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, width: "100%", p: { xs: 2, md: 4 }, bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      
      <DeviceDetailHeader 
        deviceName={device.name} 
        onBack={() => navigate(`/tenants/${activeTenantId}/devices`)} 
        onViewMessages={() => navigate(`/tenants/${activeTenantId}/messages?deviceId=${device._id}`)}
      />

      <DeviceDetailCard
        device={device}
        isEditMode={isEditMode}
        isDeleting={isDeleting}
        isSaving={isSaving}
        formData={formData}
        availableGroups={availableGroups}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancelEdit}
        onChange={handleChange}
        onGroupChange={handleGroupChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Box>
  );
}
