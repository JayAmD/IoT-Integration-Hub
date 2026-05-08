import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TenantHeader } from '../components/tenant/TenantHeader';
import { TenantList } from '../components/tenant/TenantList';
import { AddTenantModal } from '../components/tenant/AddTenantModal';
import { AddMemberModal } from '../components/tenant/AddMemberModal';
import { useTenantContext } from '../context/TenantContext';
import { useAuthContext } from '../context/AuthContext';

export default function Tenants() {
    const { tenants, loadTenants, addTenant, updateTenant, deleteTenant, addMember, removeMember, updateMemberRole } =
        useTenantContext();
    const { setActiveTenantId, activeTenantId } = useAuthContext();
    const navigate = useNavigate();

    // State
    const [filteredTenants, setFilteredTenants] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals & Notifications
    const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedTenantForMember, setSelectedTenantForMember] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Load tenants on mount
    useEffect(() => {
        const fetchTenants = async () => {
            setIsLoading(true);
            try {
                await loadTenants();
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load tenants');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTenants();
    }, []);

    // Filter tenants based on search
    useEffect(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();
        const filtered = tenants.filter((tenant) => {
            if (!normalizedSearch) return true;
            return tenant.name.toLowerCase().includes(normalizedSearch);
        });
        setFilteredTenants(filtered);
    }, [tenants, searchValue]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleSelectTenant = (tenantId) => {
        setActiveTenantId(tenantId);
        showSnackbar('Tenant selected successfully!');
        navigate(`/tenants/${tenantId}/devices`);
    };

    // --- TENANT HANDLERS ---

    const handleAddTenant = async (tenantData) => {
        try {
            await addTenant(tenantData);
            showSnackbar('Tenant created successfully!');
        } catch (err) {
            showSnackbar(err.message || 'Failed to create tenant', 'error');
        }
    };

    const handleEditTenant = async (tenantId, updateData) => {
        try {
            await updateTenant(tenantId, updateData);
            showSnackbar('Tenant updated successfully!');
        } catch (err) {
            showSnackbar(err.message || 'Failed to update tenant', 'error');
            throw err;
        }
    };

    const handleDeleteTenant = async (tenantId) => {
        try {
            await deleteTenant(tenantId);
            showSnackbar('Tenant deleted successfully!');
        } catch (err) {
            showSnackbar(err.message || 'Failed to delete tenant', 'error');
        }
    };

    // --- MEMBER HANDLERS ---

    const handleAddMemberClick = (tenant) => {
        setSelectedTenantForMember(tenant);
        setIsAddMemberModalOpen(true);
    };

    const handleAddMemberSubmit = async (email, role) => {
        if (!selectedTenantForMember) return;
        try {
            await addMember(selectedTenantForMember._id, email, role);
            showSnackbar(`Member added as ${role}!`);
            setIsAddMemberModalOpen(false);
            setSelectedTenantForMember(null);
        } catch (err) {
            showSnackbar(err.message || 'Failed to add member', 'error');
            throw err;
        }
    };

    const handleUpdateMemberRole = async (tenantId, userId, newRole) => {
        try {
            await updateMemberRole(tenantId, userId, newRole);
            showSnackbar(`Member role updated to ${newRole}!`);
        } catch (err) {
            showSnackbar(err.message || 'Failed to update member role', 'error');
        }
    };

    const handleRemoveMember = async (tenantId, userId) => {
        try {
            await removeMember(tenantId, userId);
            showSnackbar('Member removed successfully!');
        } catch (err) {
            showSnackbar(err.message || 'Failed to remove member', 'error');
        }
    };

    // --- RENDER ---

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                width: '100%',
                p: { xs: 2, md: 3 },
                bgcolor: 'grey.50',
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <TenantHeader
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onAddTenant={() => setIsAddTenantModalOpen(true)}
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
                <TenantList
                    tenants={filteredTenants}
                    activeTenantId={activeTenantId}
                    onSelect={handleSelectTenant}
                    onEdit={handleEditTenant}
                    onDelete={handleDeleteTenant}
                    onUpdateRole={handleUpdateMemberRole}
                    onRemoveMember={handleRemoveMember}
                    onAddMember={handleAddMemberClick}
                />
            )}

            <AddTenantModal
                open={isAddTenantModalOpen}
                onClose={() => setIsAddTenantModalOpen(false)}
                onAddTenant={handleAddTenant}
            />

            <AddMemberModal
                open={isAddMemberModalOpen}
                onClose={() => {
                    setIsAddMemberModalOpen(false);
                    setSelectedTenantForMember(null);
                }}
                onAddMember={handleAddMemberSubmit}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', fontWeight: 'bold' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
