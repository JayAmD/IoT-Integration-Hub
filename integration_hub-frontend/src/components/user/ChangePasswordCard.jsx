import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Stack,
    Box,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    CircularProgress
} from '@mui/material';
import {
    Lock as LockIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

export const ChangePasswordCard = ({ onSubmit, isLoading }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(currentPassword, newPassword, confirmPassword);
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
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
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ bgcolor: 'secondary.50', p: 1, borderRadius: 1.5, display: 'flex' }}>
                    <LockIcon color="secondary" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Security</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Maintain a strong password to protect your IoT fleet and sensitive credentials.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Change Password</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Current Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        disabled={isLoading}
                        InputProps={{
                            sx: { borderRadius: 2 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPasswords(!showPasswords)} edge="end" size="small">
                                        {showPasswords ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="New Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        disabled={isLoading}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        disabled={isLoading}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none' }
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
};
