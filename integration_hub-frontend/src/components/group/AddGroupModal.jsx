import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from '@mui/material';

const AddGroupModal = ({ open, onClose, onAddGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleNameChange = (e) => {
        setGroupName(e.target.value);
        setError(null);
    };

    const handleClose = () => {
        setGroupName('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        setError(null);

        // Validation
        if (!groupName.trim()) {
            setError('Group name is required.');
            return;
        }

        if (groupName.trim().length > 255) {
            setError('Group name cannot exceed 255 characters.');
            return;
        }

        setIsSubmitting(true);

        try {
            await onAddGroup({ name: groupName.trim() });
            handleClose();
        } catch (err) {
            console.error('Failed to add group:', err);
            setError(err.message || 'Failed to add group. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                elevation: 12,
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    pb: 1,
                }}
            >
                Create New Group
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        autoFocus
                        label="Group Name"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={handleNameChange}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        error={!!error}
                        helperText={error}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="success"
                    disabled={isSubmitting || !groupName.trim()}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Group'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddGroupModal;
