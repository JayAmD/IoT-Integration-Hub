import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { deviceApi } from '../../api/deviceApi.js';
import { groupApi } from '../../api/groupApi.js';
import AddDeviceHeader from './AddDeviceHeader.jsx';
import AddDeviceForm from './AddDeviceForm.jsx';

const AddDeviceModal = ({ open, onClose, onAddDevice, tenantId }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    claimToken: '',
    groups: [],
  });
  const [groups, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch groups when modal opens
  useEffect(() => {
    if (open) {
      const fetchGroups = async () => {
        try {
          if (!tenantId) return;
          const groupList = await groupApi.list(tenantId);
          setGroups(groupList || []);
        } catch (err) {
          console.error("Failed to load groups", err);
        }
      };
      fetchGroups();
    }
  }, [open, tenantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'groups') {
      setFormData((prev) => ({
        ...prev,
        groups: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ name: '', serialNumber: '', claimToken: '', groups: [] });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim() || formData.serialNumber === '' || !formData.claimToken.trim()) {
      setError('Name, Serial Number, and Claim Token are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the device payload
      const devicePayload = {
        name: formData.name.trim(),
        serialNumber: Number(formData.serialNumber),
        claimToken: formData.claimToken.trim(),
        groupIds: formData.groups, // Use groupIds for the API
      };

      // Call our centralized API wrapper
      await deviceApi.create(tenantId, devicePayload);
      
      // Since we just tell the parent to refresh the list, we don't need to pass the object back
      onAddDevice();
      handleClose();
    } catch (err) {
      console.error('Failed to add device:', err);
      // The error message comes straight from our client.js Promise.reject!
      setError(err.message || 'Failed to add device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 12,
        sx: { 
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      <AddDeviceHeader onClose={handleClose} disabled={isSubmitting} />
      
      <AddDeviceForm 
        formData={formData}
        error={error}
        isSubmitting={isSubmitting}
        groups={groups}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Dialog>
  );
};

export default AddDeviceModal;
