import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Sensors as SensorsIcon,
} from '@mui/icons-material';

import { deviceApi } from '../../api/deviceApi.js';

// Mock list of groups for the multiselect
const MOCK_GROUPS = [
  'Forest nodes',
  'Preemptive maintenance',
  'Greenhouse',
  'Factory Floor',
  'Outdoor Sensors',
];

const AddDeviceModal = ({ open, onClose, onAddDevice }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    groups: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGroupChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      // On autofill we get a stringified value.
      groups: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({ name: '', serialNumber: '', groups: [] });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim() || !formData.serialNumber.trim()) {
      setError('Name and Serial Number are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the device payload
      const devicePayload = {
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim(),
        groups: formData.groups,
      };

      // Call our centralized API wrapper
      await deviceApi.create(devicePayload);
      
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
      {/* Form Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        px: 3,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
          >
            <SensorsIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Add New Device
          </Typography>
        </Box>
        <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DialogContent sx={{ pt: 4, px: 4, pb: 2 }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', backgroundColor: '#fdeded', p: 1, borderRadius: 1 }}>
              {error}
            </Typography>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Enter the details below to register a new device to your integration hub.
          </Typography>

          <TextField
            autoFocus
            required
            id="name"
            name="name"
            label="Device Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g., Temperature Sensor A"
            sx={{ mb: 3 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <TextField
            required
            id="serialNumber"
            name="serialNumber"
            label="Serial Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.serialNumber}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g., SN-123456"
            sx={{ mb: 3 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <FormControl fullWidth disabled={isSubmitting} sx={{ mb: 1 }}>
            <InputLabel id="groups-label">Assign to Groups (Optional)</InputLabel>
            <Select
              labelId="groups-label"
              id="groups"
              name="groups"
              multiple
              value={formData.groups}
              onChange={handleGroupChange}
              input={<OutlinedInput id="select-multiple-chip" label="Assign to Groups (Optional)" sx={{ borderRadius: 2 }} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(25, 118, 210, 0.08)', 
                        color: 'primary.main',
                        fontWeight: 'bold' 
                      }} 
                    />
                  ))}
                </Box>
              )}
            >
              {MOCK_GROUPS.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #eeeeee' }}>
          <Button 
            onClick={handleClose} 
            color="inherit" 
            disabled={isSubmitting}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 'bold',
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
            sx={{ textTransform: 'none', fontWeight: 'bold', minWidth: 100 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Register Device'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddDeviceModal;
