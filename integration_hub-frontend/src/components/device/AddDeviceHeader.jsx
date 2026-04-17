import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, Sensors as SensorsIcon } from '@mui/icons-material';

export default function AddDeviceHeader({ onClose, disabled }) {
  return (
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
        onClick={onClose}
        disabled={disabled}
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
