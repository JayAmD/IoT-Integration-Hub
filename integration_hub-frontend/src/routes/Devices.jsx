import { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DevicesHeader from "../components/device/DevicesHeader.jsx";
import DeviceList from "../components/device/DeviceList.jsx";
import AddDeviceModal from "../components/device/AddDeviceModal.jsx";
import { deviceApi } from "../api/deviceApi.js";
import { useAuthContext } from "../context/AuthContext.jsx";

export default function Devices() {
  const navigate = useNavigate();
  const { activeTenantId } = useAuthContext();
  
  // State
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Sorting
  const [sortBy, setSortBy] = useState("name-asc");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  
  // Modals & Notifications
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load devices from backend
  const fetchDevices = async () => {
    if (!activeTenantId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await deviceApi.list(activeTenantId);
      // Assuming your backend returns { data: [...] }
      const deviceList = response?.data || response || [];
      setDevices(deviceList);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
      setError("Error: "+ err.message || "Failed to load devices. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDevices();
  }, [activeTenantId]);

  const handleAddDeviceClick = () => {
    setIsAddModalOpen(true);
  };

  const handleDeviceAdded = () => {
    // When a device is successfully added, we re-fetch the entire list from the backend.
    // This is generally the best practice to ensure our UI is perfectly in sync with 
    // the database, getting the real MongoDB IDs, timestamps, etc.
    fetchDevices();
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenDetail = (deviceId) => {
    // Ensure we are passing the correct MongoDB ID
    navigate(`/devices/${deviceId}`);
  };

  const handleOpenMessages = (deviceId) => {
    navigate(`/messages?deviceId=${deviceId}`);
  };

  // --- Filtering & Sorting Logic ---
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredDevices = devices.filter((device) => {
    // Ensure safe access in case backend properties are null/undefined
    const groupName = device.groupName || (device.groups && device.groups[0]) || "";
    
    const inSelectedGroup =
      groupFilter === "all" || groupName.toLowerCase().replace(/\s+/g, "-") === groupFilter;

    const matchesSearch =
      !normalizedSearch ||
      (device.name && device.name.toLowerCase().includes(normalizedSearch)) ||
      (device.serialNumber && device.serialNumber.toLowerCase().includes(normalizedSearch)) ||
      groupName.toLowerCase().includes(normalizedSearch);

    return inSelectedGroup && matchesSearch;
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
        onAddDevice={handleAddDeviceClick}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 4, textAlign: 'center', fontWeight: 'bold' }}>
          {error}
        </Typography>
      ) : (
        <DeviceList
          devices={sortedDevices}
          onOpenDetail={(deviceId) => handleOpenDetail(deviceId)}
          onOpenMessages={(deviceId) => handleOpenMessages(deviceId)}
        />
      )}

      <AddDeviceModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddDevice={handleDeviceAdded}
        tenantId={activeTenantId}
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
