import { useState, useEffect } from "react";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";

import { useCredentialContext } from "../context/CredentialContext.jsx";
import CredentialHeader from "../components/credential/CredentialHeader.jsx";
import CredentialList from "../components/credential/CredentialList.jsx";
import CredentialModal from "../components/credential/CredentialModal.jsx";

export default function Credentials() {
  const { 
    credentials, 
    isLoading, 
    error, 
    loadCredentials, 
    addCredential, 
    updateCredential, 
    deleteCredential 
  } = useCredentialContext();

  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- HANDLERS ---

  const handleOpenAddModal = () => {
    setEditingCredential(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (credential) => {
    setEditingCredential(credential);
    setIsModalOpen(true);
  };

  const handleSaveCredential = async (data) => {
    try {
      if (editingCredential) {
        await updateCredential(editingCredential._id, data);
        showSnackbar('Credential updated successfully!');
      } else {
        await addCredential(data);
        showSnackbar('Credential created successfully!');
      }
    } catch (err) {
      showSnackbar(err.message || 'Failed to save credential', 'error');
      throw err; // Re-throw to keep modal open on error
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this credential?")) {
      try {
        await deleteCredential(id);
        showSnackbar('Credential deleted successfully!');
      } catch (err) {
        showSnackbar(err.message || 'Failed to delete credential', 'error');
      }
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
      <CredentialHeader onAddCredential={handleOpenAddModal} />

      {isLoading && !credentials.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CredentialList 
          credentials={credentials}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <CredentialModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCredential}
        credential={editingCredential}
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
