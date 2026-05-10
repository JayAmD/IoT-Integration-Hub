import React from 'react';
import { Paper, Typography, Stack, Box, Divider } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

export const AccountDetailsCard = ({ email }) => (
    <Paper
        elevation={0}
        sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
        }}
    >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Account Details</Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={2}>
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Email Address
                </Typography>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'primary.50',
                        border: '1px solid',
                        borderColor: 'primary.100',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <EmailIcon color="primary" />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {email || 'N/A'}
                    </Typography>
                </Paper>
            </Box>
            <Typography variant="body2" color="text.secondary">
                This email is used for identification across all tenants.
            </Typography>
        </Stack>
    </Paper>
);
