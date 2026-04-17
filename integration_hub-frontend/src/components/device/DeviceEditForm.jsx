import React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function DeviceEditForm({
  device,
  formData,
  availableGroups,
  isSaving,
  onChange,
  onGroupChange,
  onSave,
  onCancel
}) {
  return (
    <Box component="form" onSubmit={onSave}>
      <Stack spacing={3}>
        <TextField
          required
          id="name"
          name="name"
          label="Device Name"
          value={formData.name}
          onChange={onChange}
          disabled={isSaving}
          fullWidth
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          disabled
          id="serialNumber"
          label="Serial Number"
          value={device.serialNumber}
          fullWidth
          InputProps={{ sx: { borderRadius: 2, bgcolor: 'grey.50' } }}
          helperText="Serial numbers cannot be modified."
        />

        <FormControl fullWidth disabled={isSaving}>
          <InputLabel id="groups-label">Assigned Groups</InputLabel>
          <Select
            labelId="groups-label"
            id="groups"
            name="groups"
            multiple
            value={formData.groupIds}
            onChange={onGroupChange}
            input={<OutlinedInput label="Assigned Groups" sx={{ borderRadius: 2 }} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const group = availableGroups.find(g => g._id === value) || device.groups?.find(g => g._id === value);
                  return (
                    <Chip
                      key={value}
                      label={group ? group.name : value}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.main',
                        fontWeight: 'bold',
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableGroups.map((group) => (
              <MenuItem key={group._id} value={group._id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 2 }}>
          <Button
            onClick={onCancel}
            disabled={isSaving}
            startIcon={<CloseOutlinedIcon />}
            sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveOutlinedIcon />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
