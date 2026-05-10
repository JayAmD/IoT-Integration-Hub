import React from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeviceEditForm from './DeviceEditForm.jsx';
import DeviceView from './DeviceView.jsx';

export default function DeviceDetailCard({
  device,
  isEditMode,
  isDeleting,
  isSaving,
  formData,
  availableGroups,
  onEditClick,
  onCancelEdit,
  onChange,
  onGroupChange,
  onSave,
  onDelete,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        maxWidth: 800,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 0.5, letterSpacing: -0.5 }}>
              {device.name}
            </Typography>
          </Box>
        </Box>

        {!isEditMode && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditOutlinedIcon />}
              onClick={onEditClick}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlinedIcon />}
              onClick={onDelete}
              disabled={isDeleting}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {isEditMode ? (
        <DeviceEditForm
          device={device}
          formData={formData}
          availableGroups={availableGroups}
          isSaving={isSaving}
          onChange={onChange}
          onGroupChange={onGroupChange}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      ) : (
        <DeviceView device={device} />
      )}
    </Paper>
  );
}

