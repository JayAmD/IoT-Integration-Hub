import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Divider,
  IconButton,
  Breadcrumbs,
  Link
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { deviceApi } from "../api/deviceApi.js";

const MOCK_GROUPS = [
  { _id: "69df97eec51520290372c33e", name: 'FOREST nodes' },
  { _id: "69df9994c51520290372c345", name: 'CNC123' },
  { _id: "3", name: 'Greenhouse' },
  { _id: "4", name: 'Factory Floor' },
  { _id: "5", name: 'Outdoor Sensors' },
];

export default function DeviceDetail() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [device, setDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    groupIds: [],
  });

  // Load device data on mount
  useEffect(() => {
    const loadDevice = async () => {
      setIsLoading(true);
      try {
        const response = await deviceApi.getById(deviceId);
        const data = response.data || response;
        setDevice(data);
        setFormData({
          name: data.name || '',
          groupIds: data.groups ? data.groups.map(g => g._id) : [],
        });
      } catch (error) {
        console.error("Failed to load device data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDevice();
  }, [deviceId]);

  const handleEditClick = () => {
    setIsEditMode(true);
    setFormData({
      name: device.name || '',
      groupIds: device.groups ? device.groups.map(g => g._id) : [],
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGroupChange = (event) => {
    const { target: { value } } = event;
    setFormData(prev => ({
      ...prev,
      groupIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await deviceApi.update(deviceId, {
        name: formData.name,
        groupIds: formData.groupIds
      });
      const updatedData = response.data || response;
      setDevice(updatedData);
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save device", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      setIsDeleting(true);
      try {
        await deviceApi.delete(deviceId);
        navigate('/devices');
      } catch (error) {
        console.error("Failed to delete device", error);
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.50' }}>
        <CircularProgress size={40} thickness={4} sx={{ color: 'primary.light' }} />
      </Box>
    );
  }

  if (!device) {
    return (
      <Box sx={{ p: 4, bgcolor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
        <Typography>Device not found.</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, width: "100%", p: { xs: 2, md: 4 }, bgcolor: "grey.50", minHeight: "calc(100vh - 64px)" }}>
      
      {/* Lightweight Header & Breadcrumbs */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <IconButton onClick={() => navigate('/devices')} size="small" sx={{ color: 'text.secondary', ml: -1 }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
            <Link underline="hover" color="inherit" href="/devices" sx={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigate('/devices'); }}>
              Devices
            </Link>
            <Typography color="text.primary" fontWeight="medium">{device.name}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Main Content Card */}
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
                onClick={handleEditClick}
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
                onClick={handleDelete}
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
          /* EDIT MODE FORM */
          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={3}>
              <TextField
                required
                id="name"
                name="name"
                label="Device Name"
                value={formData.name}
                onChange={handleChange}
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
                  onChange={handleGroupChange}
                  input={<OutlinedInput label="Assigned Groups" sx={{ borderRadius: 2 }} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const group = MOCK_GROUPS.find(g => g._id === value) || device.groups?.find(g => g._id === value);
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
                  {MOCK_GROUPS.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  onClick={handleCancelEdit}
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
        ) : (
          /* VIEW MODE */
          <Stack spacing={3}>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Serial Number
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>
                {device.serialNumber}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Assigned Groups
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {device.groups && device.groups.length > 0 ? (
                    device.groups.map(group => (
                        <Chip
                            key={group._id}
                            label={group.name}
                            size="small"
                            sx={{
                              bgcolor: 'grey.100',
                              color: 'text.primary',
                              fontWeight: 500,
                              borderRadius: 1
                            }}
                        />
                    ))
                ) : (
                    <Typography variant="body2" color="text.disabled" fontStyle="italic">
                      No groups assigned.
                    </Typography>
                )}
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Device ID
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary', fontFamily: 'monospace' }}>
                {device._id}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Created at
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>
                {device.createdAt ? new Date(device.createdAt).toLocaleString() : 'N/A'}
              </Typography>
            </Box>

          </Stack>
        )}
      </Paper>
    </Box>
  );
}
