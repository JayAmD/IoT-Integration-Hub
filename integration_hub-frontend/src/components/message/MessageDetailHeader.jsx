import React, { useState } from "react";
import { Box, Stack, Typography, Button, Breadcrumbs, Link, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function MessageDetailHeader({ onBack, onRefresh, isLoading }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ cursor: 'pointer' }}
          onClick={(e) => { e.preventDefault(); onBack(); }}
        >
          Messages
        </Link>
        <Typography color="text.primary">Detail</Typography>
      </Breadcrumbs>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Message Detail
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />} 
              onClick={onRefresh}
              disabled={isLoading}
              sx={{ 
                borderRadius: 2,
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                '& .MuiButton-startIcon svg': {
                  animation: isLoading ? 'spin 2s linear infinite' : 'none'
                }
              }}
          >
              Refresh
          </Button>
          <Button 
              variant="outlined" 
              startIcon={<ContentCopyIcon />} 
              onClick={handleCopyLink}
              sx={{ borderRadius: 2 }}
          >
              Copy Link
          </Button>
          <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />} 
              onClick={onBack}
              sx={{ borderRadius: 2, px: 3 }}
          >
              Back to List
          </Button>
        </Stack>
      </Stack>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
