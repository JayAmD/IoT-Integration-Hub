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
  Typography,
  Autocomplete,
  Box,
  IconButton,
  Switch,
  FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useGroupContext } from '../../context/GroupContext.jsx';
import { useCredentialContext } from '../../context/CredentialContext.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';

export default function EndpointModal({ open, onClose, onSave, endpoint }) {
  const { activeTenantId } = useAuthContext();
  const { groups, loadGroups } = useGroupContext();
  const { credentials, loadCredentials } = useCredentialContext();

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'POST',
    groupIds: [],
    credentialId: '',
    isActive: true,
  });

  // Headers state as an array of objects { key, value } for easy UI mapping
  const [headerPairs, setHeaderPairs] = useState([{ key: '', value: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadGroups(activeTenantId);
      loadCredentials(activeTenantId);
    }
  }, [open, activeTenantId, loadGroups, loadCredentials]);

  useEffect(() => {
    if (endpoint) {
      setFormData({
        name: endpoint.name || '',
        url: endpoint.url || '',
        method: endpoint.method || 'POST',
        groupIds: endpoint.groupIds ? endpoint.groupIds.map(g => g._id || g) : [],
        credentialId: endpoint.credentialId ? (endpoint.credentialId._id || endpoint.credentialId) : '',
        isActive: endpoint.isActive !== undefined ? endpoint.isActive : true,
      });

      // Convert Map/Object headers to UI pairs
      const headers = endpoint.headers || {};
      const pairs = Object.entries(headers).map(([key, value]) => ({ key, value }));
      setHeaderPairs(pairs.length > 0 ? pairs : [{ key: '', value: '' }]);
    } else {
      setFormData({
        name: '',
        url: '',
        method: 'POST',
        groupIds: [],
        credentialId: '',
        isActive: true,
      });
      setHeaderPairs([{ key: '', value: '' }]);
    }
  }, [endpoint, open]);

  const handleAddHeader = () => {
    setHeaderPairs([...headerPairs, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index) => {
    const next = [...headerPairs];
    next.splice(index, 1);
    setHeaderPairs(next.length > 0 ? next : [{ key: '', value: '' }]);
  };

  const handleHeaderChange = (index, field, value) => {
    const next = [...headerPairs];
    next[index][field] = value;
    setHeaderPairs(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Convert header pairs back to object
      const headers = {};
      headerPairs.forEach(p => {
        if (p.key.trim()) headers[p.key.trim()] = p.value;
      });

      const dataToSave = { 
        ...formData, 
        headers,
        credentialId: formData.credentialId || null // Ensure empty string becomes null
      };
      
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
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {endpoint ? 'Edit Endpoint' : 'Add New Endpoint'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Friendly Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Production Webhook"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                  />
                }
                label="Is Active"
                sx={{ minWidth: '120px' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ minWidth: '120px' }}>
                <InputLabel>Method</InputLabel>
                <Select
                  value={formData.method}
                  label="Method"
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                >
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Target URL"
                fullWidth
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://api.yourdomain.com/webhook"
              />
            </Stack>

            <Autocomplete
              multiple
              options={groups}
              getOptionLabel={(option) => option.name}
              value={groups.filter(g => formData.groupIds.includes(g._id))}
              onChange={(event, newValue) => {
                setFormData({ ...formData, groupIds: newValue.map(g => g._id) });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Trigger Groups" placeholder="Select groups..." />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Authentication Credential (Optional)</InputLabel>
              <Select
                value={formData.credentialId}
                label="Authentication Credential (Optional)"
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              >
                <MenuItem value=""><em>None (Public API)</em></MenuItem>
                {credentials.map(c => (
                  <MenuItem key={c._id} value={c._id}>{c.name} ({c.provider})</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Custom Headers
              </Typography>
              {headerPairs.map((pair, index) => (
                <Stack key={index} direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    placeholder="Key"
                    size="small"
                    value={pair.key}
                    onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    placeholder="Value"
                    size="small"
                    value={pair.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small" onClick={() => handleRemoveHeader(index)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                size="small" 
                onClick={handleAddHeader}
                sx={{ mt: 0.5, textTransform: 'none' }}
              >
                Add Header
              </Button>
            </Box>

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
            {isSubmitting ? 'Saving...' : 'Save Endpoint'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
