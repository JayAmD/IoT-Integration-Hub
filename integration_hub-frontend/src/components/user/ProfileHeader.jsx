import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export const ProfileHeader = () => (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            mb: 3,
        }}
    >
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
            User Profile
        </Typography>
    </Paper>
);
