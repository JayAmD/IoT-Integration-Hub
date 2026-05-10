import React, { useState } from 'react';
import { Box, Stack, Snackbar, Alert } from '@mui/material';
import { useAuthContext } from '../context/AuthContext';
import { userApi } from '../api/userApi';

// Sub-components
import { ProfileHeader } from '../components/user/ProfileHeader';
import { AccountDetailsCard } from '../components/user/AccountDetailsCard';
import { ChangePasswordCard } from '../components/user/ChangePasswordCard';
import { DangerZoneCard } from '../components/user/DangerZoneCard';
import { DeleteAccountDialog } from '../components/user/DeleteAccountDialog';

const Profile = () => {
    const { user, logout } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const handleChangePassword = async (currentPassword, newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            setSnackbar({ open: true, message: 'New passwords do not match', severity: 'error' });
            return false;
        }

        setIsLoading(true);
        try {
            await userApi.updatePassword(currentPassword, newPassword);
            setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
            return true;
        } catch (err) {
            setSnackbar({ open: true, message: err.message || 'Failed to update password', severity: 'error' });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await userApi.deleteMe();
            logout(); // Log out and redirect to login
        } catch (err) {
            setSnackbar({ open: true, message: err.message || 'Failed to delete account', severity: 'error' });
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                width: '100%',
                p: { xs: 2, md: 3 },
                bgcolor: 'grey.50',
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <ProfileHeader />

            <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto' }}>
                <AccountDetailsCard email={user?.email} />

                <ChangePasswordCard 
                    onSubmit={handleChangePassword} 
                    isLoading={isLoading} 
                />

                <DangerZoneCard 
                    onDeleteClick={() => setIsDeleteDialogOpen(true)} 
                />
            </Stack>

            <DeleteAccountDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isLoading}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity} 
                    variant="filled" 
                    sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
