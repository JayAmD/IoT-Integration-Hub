import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { deviceApi } from "../api/deviceApi.js";
import { groupApi } from "../api/groupApi.js";

import DeviceDetailHeader from "../components/device/DeviceDetailHeader.jsx";
import DeviceDetailCard from "../components/device/DeviceDetailCard.jsx";

export default function DeviceDetail() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [device, setDevice] = useState(null);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    groupIds: [],
  });

  // Load device and groups data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [deviceResponse, groupsResponse] = await Promise.all([
          deviceApi.getById(deviceId),
          groupApi.list()
        ]);
        
        const deviceData = deviceResponse.data || deviceResponse;
        const groupsData = groupsResponse.data || groupsResponse || [];

        setDevice(deviceData);
        setAvailableGroups(groupsData);
        setFormData({
          name: deviceData.name || '',
          groupIds: deviceData.groups ? deviceData.groups.map(g => g._id) : [],
        });
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [deviceId]);

  const handleEditClick = () => {
    setIsEditMode(true);
    setFormData({
      name: device.name || '',
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
      const response = await deviceApi.update(deviceId, {
        name: formData.name,
        groupIds: formData.groupIds
      });
      const updatedData = response.data || response;
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
        await deviceApi.delete(deviceId);
        navigate('/devices');
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
        onBack={() => navigate('/devices')} 
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
