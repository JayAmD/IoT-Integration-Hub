import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Typography,
} from '@mui/material';

export const AddTenantModal = ({ open, onClose, onAddTenant }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Tenant name is required');
            return false;
        }
        if (formData.name.trim().length > 255) {
            setError('Tenant name must be 255 characters or less');
            return false;
        }
        if (formData.description.length > 1000) {
            setError('Description must be 1000 characters or less');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onAddTenant({
                name: formData.name.trim(),
                description: formData.description.trim(),
            });
            setFormData({ name: '', description: '' });
            setError('');
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create tenant');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({ name: '', description: '' });
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
            <DialogTitle sx={{ fontWeight: 600 }}>Create New Tenant</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ pt: 2 }}>
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        label="Tenant Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        disabled={isLoading}
                        placeholder="e.g., Acme Inc."
                        inputProps={{ maxLength: 255 }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        disabled={isLoading}
                        multiline
                        maxRows={3}
                        placeholder="Optional description for this tenant"
                        inputProps={{ maxLength: 1000 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formData.description.length}/1000
                    </Typography>
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
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    {isLoading ? <CircularProgress size={20} /> : null}
                    {isLoading ? 'Creating...' : 'Create Tenant'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
