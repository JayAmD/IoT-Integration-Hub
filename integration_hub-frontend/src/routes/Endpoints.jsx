import { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";

import { useEndpointContext } from "../context/EndpointContext.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import EndpointHeader from "../components/endpoint/EndpointHeader.jsx";
import EndpointList from "../components/endpoint/EndpointList.jsx";
import EndpointModal from "../components/endpoint/EndpointModal.jsx";

export default function Endpoints() {
  const { activeTenantId } = useAuthContext();
  const { 
    endpoints, 
    isLoading, 
    error, 
    loadEndpoints, 
    addEndpoint, 
    updateEndpoint, 
    deleteEndpoint
  } = useEndpointContext();

  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (activeTenantId) {
      loadEndpoints(activeTenantId);
    }
  }, [loadEndpoints, activeTenantId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- HANDLERS ---

  const handleOpenAddModal = () => {
    setEditingEndpoint(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (endpoint) => {
    setEditingEndpoint(endpoint);
    setIsModalOpen(true);
  };

  const handleSaveEndpoint = async (data) => {
    try {
      if (editingEndpoint) {
        await updateEndpoint(activeTenantId, editingEndpoint._id, data);
        showSnackbar('Endpoint updated successfully!');
      } else {
        await addEndpoint(activeTenantId, data);
        showSnackbar('Endpoint created successfully!');
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to save endpoint', 'error');
      throw err; 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this endpoint?")) {
      try {
        await deleteEndpoint(activeTenantId, id);
        showSnackbar('Endpoint deleted successfully!');
      } catch (err) {
        showSnackbar(err.message || 'Failed to delete endpoint', 'error');
      }
    }
  };

  const handleToggleActive = async (endpoint) => {
    try {
      await updateEndpoint(activeTenantId, endpoint._id, { isActive: !endpoint.isActive });
      showSnackbar(`Endpoint ${!endpoint.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      showSnackbar(err.message || 'Failed to toggle endpoint status', 'error');
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1, 
        width: "100%", 
        p: { xs: 2, md: 3 }, 
        bgcolor: "grey.50", 
        minHeight: "calc(100vh - 64px)" 
      }}
    >
      <EndpointHeader onAddEndpoint={handleOpenAddModal} />

      {isLoading && !endpoints.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EndpointList 
          endpoints={endpoints}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      )}

      <EndpointModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEndpoint}
        endpoint={editingEndpoint}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 'bold' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
