import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';

export default function DeviceView({ device }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Serial Number
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>
          {device.serialNumber}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Assigned Groups
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {device.groups && device.groups.length > 0 ? (
            device.groups.map(group => (
              <Chip
                key={group._id}
                label={group.name}
                size="small"
                sx={{
                  bgcolor: 'grey.100',
                  color: 'text.primary',
                  fontWeight: 500,
                  borderRadius: 1
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No groups assigned.
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Device ID
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary', fontFamily: 'monospace' }}>
          {device._id}
        </Typography>
      </Box>
      
      <Box>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Created at
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>
          {device.createdAt ? new Date(device.createdAt).toLocaleString() : 'N/A'}
        </Typography>
      </Box>
    </Stack>
  );
}
