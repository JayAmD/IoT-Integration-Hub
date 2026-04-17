import React from 'react';
import { Box, Breadcrumbs, IconButton, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DeviceDetailHeader({ deviceName, onBack }) {
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
    </Box>
  );
}
