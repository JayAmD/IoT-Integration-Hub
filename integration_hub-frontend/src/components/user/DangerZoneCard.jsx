import React from 'react';
import { Paper, Typography, Stack, Box, Divider, Button } from '@mui/material';
import { DeleteForever as DeleteIcon } from '@mui/icons-material';

export const DangerZoneCard = ({ onDeleteClick }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'error.light',
            bgcolor: 'error.50',
        }}
    >
        <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 700 }}>Danger Zone</Typography>
        <Divider sx={{ mb: 3, borderColor: 'error.100' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.900' }}>Delete Account</Typography>
                <Typography variant="body2" color="error.800">
                    This will permanently remove your account and all membership data. This cannot be undone.
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onDeleteClick}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none', bgcolor: 'error.main' }
                }}
            >
                Delete Account
            </Button>
        </Stack>
    </Paper>
);
