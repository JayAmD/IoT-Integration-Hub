import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography
} from "@mui/material";

export default function CredentialModal({ open, onClose, onSave, credential }) {
  const [formData, setFormData] = useState({
    name: '',
    provider: 'custom',
    secret: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name || '',
        provider: credential.provider || 'custom',
        secret: '' // Don't show old secret for security; only set if changing
      });
    } else {
      setFormData({ name: '', provider: 'custom', secret: '' });
    }
  }, [credential, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Only include secret if it was provided (especially on edit)
      const dataToSave = { ...formData };
      if (!formData.secret && credential) {
        delete dataToSave.secret;
      }
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {credential ? 'Edit Credential' : 'Add New Credential'}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Friendly Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. My Production AWS Key"
            />

            <FormControl fullWidth required>
              <InputLabel>Provider</InputLabel>
              <Select
                value={formData.provider}
                label="Provider"
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              >
                <MenuItem value="custom">Custom (Generic REST)</MenuItem>
                <MenuItem value="aws">AWS (Amazon Web Services)</MenuItem>
                <MenuItem value="azure">Azure (Microsoft)</MenuItem>
                <MenuItem value="google">Google Cloud</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={credential ? "New Secret (leave blank to keep current)" : "Secret / API Key"}
              fullWidth
              required={!credential}
              type="password"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              autoComplete="new-password"
            />
            
            {credential && (
              <Typography variant="caption" color="text.secondary">
                Security note: The current secret is encrypted and cannot be viewed. Provide a new one to rotate the key.
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={isSubmitting} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {isSubmitting ? 'Saving...' : 'Save Credential'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
