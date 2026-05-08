import React from 'react';
import { Stack, TextField, Button, InputAdornment, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

export const TenantHeader = ({ searchValue, onSearchChange, onAddTenant }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 2.5 },
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
                        Tenants
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={onAddTenant}
                        sx={{ borderRadius: 2, px: 2.25, textTransform: 'none', fontWeight: 600 }}
                    >
                        Add Tenant
                    </Button>
                </Stack>

                <TextField
                    size="small"
                    placeholder="Search tenants by name..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ width: '100%', maxWidth: { lg: 440 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                    }}
                />
            </Stack>
        </Paper>
    );
};
