import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';

export const DeleteAccountDialog = ({ open, onClose, onConfirm, isLoading }) => {
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleConfirm = () => {
        if (deleteConfirmText === 'DELETE') {
            onConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>Confirm Account Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    Are you absolutely sure? This action is irreversible.
                    <br /><br />
                    Please type <Typography component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>DELETE</Typography> to confirm.
                </DialogContentText>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="DELETE"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    disabled={isLoading}
                    InputProps={{ sx: { borderRadius: 2 } }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={isLoading} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={deleteConfirmText !== 'DELETE' || isLoading}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none' }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Permanently Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
