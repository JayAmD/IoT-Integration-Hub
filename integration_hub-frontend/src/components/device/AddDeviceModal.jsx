import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import AddDeviceHeader from './AddDeviceHeader.jsx';
import AddDeviceForm from './AddDeviceForm.jsx';

const AddDeviceModal = ({ 
    open, 
    onClose, 
    onAddDevice, 
    groups, 
    isLoading, 
    error 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    claimToken: '',
    groups: [],
  });
  
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
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare payload for the orchestrator
    const devicePayload = {
      name: formData.name.trim(),
      serialNumber: Number(formData.serialNumber),
      claimToken: formData.claimToken.trim(),
      groupIds: formData.groups,
    };

    onAddDevice(devicePayload);
  };

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? undefined : handleClose}
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
      <AddDeviceHeader onClose={handleClose} disabled={isLoading} />
      
      <AddDeviceForm 
        formData={formData}
        error={error}
        isSubmitting={isLoading}
        groups={groups}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Dialog>
  );
};

export default AddDeviceModal;
