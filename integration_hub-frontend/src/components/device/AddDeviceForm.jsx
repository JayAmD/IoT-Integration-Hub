import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress,
} from '@mui/material';

export default function AddDeviceForm({
  formData,
  error,
  isSubmitting,
  groups,
  onChange,
  onSubmit,
  onCancel
}) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DialogContent sx={{ pt: 4, px: 4, pb: 2 }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center', backgroundColor: '#fdeded', p: 1, borderRadius: 1 }}>
            {error}
          </Typography>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Enter the details below to register a new device to your integration hub.
        </Typography>

        <TextField
          autoFocus
          required
          id="name"
          name="name"
          label="Device Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={onChange}
          disabled={isSubmitting}
          placeholder="e.g., Temperature Sensor A"
          sx={{ mb: 3 }}
          InputProps={{
            sx: { borderRadius: 2 }
          }}
        />

        <TextField
          required
          id="serialNumber"
          name="serialNumber"
          label="Serial Number"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.serialNumber}
          onChange={onChange}
          disabled={isSubmitting}
          placeholder="e.g., 123456"
          sx={{ mb: 3 }}
          InputProps={{
            sx: { borderRadius: 2 }
          }}
        />

        <TextField
          required
          id="claimToken"
          name="claimToken"
          label="Claim Token"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.claimToken}
          onChange={onChange}
          disabled={isSubmitting}
          placeholder="e.g., A1B2C3D4"
          sx={{ mb: 3 }}
          InputProps={{
            sx: { borderRadius: 2 }
          }}
          helperText="Unique token provided with the device."
        />

        <FormControl fullWidth disabled={isSubmitting} sx={{ mb: 1 }}>
          <InputLabel id="groups-label">Assign to Groups (Optional)</InputLabel>
          <Select
            labelId="groups-label"
            id="groups"
            name="groups"
            multiple
            value={formData.groups}
            onChange={onChange}
            input={<OutlinedInput id="select-multiple-chip" label="Assign to Groups (Optional)" sx={{ borderRadius: 2 }} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const group = groups.find(g => g._id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={group ? group.name : value} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(25, 118, 210, 0.08)', 
                        color: 'primary.main',
                        fontWeight: 'bold' 
                      }} 
                    />
                  );
                })}
              </Box>
            )}
          >
            {groups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      
      <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f8f9fa', borderTop: '1px solid #eeeeee' }}>
        <Button 
          onClick={onCancel} 
          color="inherit" 
          disabled={isSubmitting}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 'bold',
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
          sx={{ textTransform: 'none', fontWeight: 'bold', minWidth: 100 }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Register Device'}
        </Button>
      </DialogActions>
    </Box>
  );
}
