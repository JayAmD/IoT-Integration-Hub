import { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DevicesHeader from "../components/device/DevicesHeader.jsx";
import DeviceList from "../components/device/DeviceList.jsx";
import AddDeviceModal from "../components/device/AddDeviceModal.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useDeviceContext } from "../context/DeviceContext.jsx";
import { useGroupContext } from "../context/GroupContext.jsx";

export default function Devices() {
  const navigate = useNavigate();
  const { activeTenantId } = useAuthContext();
  const { devices, isLoading: isDevicesLoading, error: contextError, fetchDevices, addDevice } = useDeviceContext();
  const { groups, loadGroups } = useGroupContext();
  
  // Local Orchestration State
  const [sortBy, setSortBy] = useState("name-asc");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  
  // Modal & Submit State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Initial load
  useEffect(() => {
    if (activeTenantId) {
      fetchDevices(activeTenantId);
      loadGroups(activeTenantId).catch(err => console.error("Failed to load groups", err));
    }
  }, [activeTenantId]);

  const handleOpenAddModal = () => {
    setSubmitError(null);
    setIsAddModalOpen(true);
  };

  const handleAddDevice = async (devicePayload) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await addDevice(activeTenantId, devicePayload);
      setSnackbarOpen(true);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add device:', err);
      setSubmitError(err.message || 'Failed to add device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleOpenDetail = (deviceId) => {
    navigate(`/tenants/${activeTenantId}/devices/${deviceId}`);
  };

  const handleOpenMessages = (deviceId) => {
    navigate(`/tenants/${activeTenantId}/messages?deviceId=${deviceId}`);
  };

  // --- Filtering & Sorting Logic (Orchestration) ---
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredDevices = devices.filter((device) => {
    const hasGroupMatch = groupFilter === "all" || 
      (device.groups && device.groups.some(g => g.name.toLowerCase().replace(/\s+/g, "-") === groupFilter));

    const matchesSearch =
      !normalizedSearch ||
      (device.name && device.name.toLowerCase().includes(normalizedSearch)) ||
      (device.serialNumber && device.serialNumber.toString().includes(normalizedSearch)) ||
      (device.groups && device.groups.some(g => g.name.toLowerCase().includes(normalizedSearch)));

    return hasGroupMatch && matchesSearch;
  });

  const sortedDevices = [...filteredDevices].sort((first, second) => {
    const nameA = first.name || "";
    const nameB = second.name || "";
    const timeA = first.lastSeenAt ? new Date(first.lastSeenAt).getTime() : 0;
    const timeB = second.lastSeenAt ? new Date(second.lastSeenAt).getTime() : 0;

    if (sortBy === "name-asc") return nameA.localeCompare(nameB);
    if (sortBy === "name-desc") return nameB.localeCompare(nameA);
    if (sortBy === "last-seen-desc") return timeB - timeA;
    return timeA - timeB;
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: "100%",
        p: { xs: 2, md: 3 },
        bgcolor: "grey.50",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <DevicesHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        groupFilter={groupFilter}
        onGroupFilterChange={setGroupFilter}
        onAddDevice={handleOpenAddModal}
      />

      {isDevicesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : contextError ? (
        <Typography color="error" sx={{ mt: 4, textAlign: 'center', fontWeight: 'bold' }}>
          {contextError}
        </Typography>
      ) : (
        <DeviceList
          devices={sortedDevices}
          onOpenDetail={handleOpenDetail}
          onOpenMessages={handleOpenMessages}
        />
      )}

      <AddDeviceModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddDevice={handleAddDevice}
        groups={groups}
        isLoading={isSubmitting}
        error={submitError}
      />

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', fontWeight: 'bold' }}>
          Device added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
