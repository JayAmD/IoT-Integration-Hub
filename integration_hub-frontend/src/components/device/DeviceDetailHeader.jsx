import React from 'react';
import { Box, Breadcrumbs, IconButton, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DeviceDetailHeader({ deviceName, onBack, onViewMessages }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <IconButton onClick={onBack} size="small" sx={{ color: 'text.secondary', ml: -1 }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
          <Link underline="hover" color="inherit" href="/devices" sx={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onBack(); }}>
            Devices
          </Link>
          <Typography color="text.primary" fontWeight="medium">{deviceName}</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          {deviceName}
        </Typography>
        <Link 
          component="button"
          variant="body2" 
          onClick={onViewMessages}
          sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          View Device Messages
        </Link>
      </Box>
    </Box>
  );
}
