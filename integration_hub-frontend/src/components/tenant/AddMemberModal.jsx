import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
    CircularProgress,
    Typography,
} from '@mui/material';

export const AddMemberModal = ({ open, onClose, onAddMember }) => {
    const [formData, setFormData] = useState({ email: '', role: 'viewer' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(formData.email.trim())) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.role) {
            setError('Role is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onAddMember(formData.email.trim().toLowerCase(), formData.role);
            setFormData({ email: '', role: 'viewer' });
            setError('');
            onClose();
        } catch (err) {
            const errMsg = err.message || 'Failed to add member';
            if (errMsg.toLowerCase().includes('already')) {
                setError('This user is already a member of this tenant');
            } else if (errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('no user')) {
                setError('No account found with that email address');
            } else {
                setError(errMsg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({ email: '', role: 'viewer' });
            setError('');
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Add Member to Tenant</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 2 }}>
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        label="User Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        disabled={isLoading}
                        placeholder="user@example.com"
                        helperText="Enter the email address of the user to invite"
                    />
                    <FormControl fullWidth disabled={isLoading}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                        >
                            <MenuItem value="viewer">Viewer (read-only)</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="owner">Owner (full control)</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ gap: 1, p: 2 }}>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                >
                    {isLoading ? <CircularProgress size={20} /> : null}
                    {isLoading ? 'Adding...' : 'Add Member'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
