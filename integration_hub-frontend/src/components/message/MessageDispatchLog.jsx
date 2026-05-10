import React from "react";
import { Paper, Typography, Stack, Box, Chip, Link as MuiLink, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function MessageDispatchLog({ dispatches, tenantId }) {
  const statusIcons = {
    delivered: <CheckCircleOutlineIcon color="success" fontSize="small" />,
    failed: <ErrorOutlineIcon color="error" fontSize="small" />,
    pending: <PendingActionsIcon color="warning" fontSize="small" />
  };

  const statusColors = {
    delivered: "success",
    failed: "error",
    pending: "warning"
  };

  const hasNoTargets = !dispatches || dispatches.length === 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Dispatch History</Typography>
      
      {hasNoTargets && (
        <Alert 
          severity="warning" 
          icon={<WarningAmberIcon fontSize="inherit" />}
          sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'warning.light' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            No dispatch targets identified!
          </Typography>
          This device is not assigned to any Groups that have Endpoints, or the device has no groups at all. Data is being ingested but not forwarded.
        </Alert>
      )}

      <Stack spacing={2}>
        {!hasNoTargets ? (
          dispatches.map((dispatch, index) => (
            <Box 
              key={index} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    {statusIcons[dispatch.status]}
                    <MuiLink 
                        component={RouterLink} 
                        to={`/tenants/${tenantId}/endpoints`}
                        sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                    >
                      {dispatch.endpointId?.name || 'Deleted Endpoint'}
                    </MuiLink>
                    <Chip 
                        label={dispatch.status.toUpperCase()} 
                        size="small" 
                        color={statusColors[dispatch.status]}
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {dispatch.endpointId?.url}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ textAlign: { sm: 'right' } }}>
                    <Typography variant="caption" color="text.secondary" display="block">ATTEMPTS</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dispatch.deliveryAttempts} / 10
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { sm: 'right' }, minWidth: 140 }}>
                    <Typography variant="caption" color="text.secondary" display="block">LAST ATTEMPT</Typography>
                    <Typography variant="body2">
                      {dispatch.lastAttemptAt ? new Date(dispatch.lastAttemptAt).toLocaleTimeString() : 'Never'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {dispatch.lastError && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'error.lighter', borderRadius: 1.5, borderLeft: '4px solid', borderColor: 'error.main' }}>
                  <Typography variant="caption" color="error.dark" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                    LAST ERROR
                  </Typography>
                  <Typography variant="body2" color="error.dark" sx={{ fontFamily: 'monospace' }}>
                    {dispatch.lastError}
                  </Typography>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography color="text.disabled" sx={{ fontStyle: 'italic' }}>
            No dispatch targets were identified for this message.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
