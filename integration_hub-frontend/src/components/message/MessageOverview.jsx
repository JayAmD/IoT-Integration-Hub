import React from "react";
import { Paper, Stack, Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function MessageOverview({ message, tenantId }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Overview</Typography>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={4} 
        divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">MESSAGE ID</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{message._id}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">DEVICE SERIAL NUMBER</Typography>
          <MuiLink 
            component={RouterLink} 
            to={`/tenants/${tenantId}/devices/${message.deviceId?._id || ''}`}
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {message.serialNumber}
          </MuiLink>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">RECEIVED AT</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{new Date(message.receivedAt).toLocaleString()}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
