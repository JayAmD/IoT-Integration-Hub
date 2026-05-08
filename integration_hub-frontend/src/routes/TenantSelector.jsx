import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tenantApi } from '../api/tenantApi.js';
import { useAuthContext } from '../context/AuthContext.jsx';

export default function TenantSelector() {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        tenants,
        activeTenantId,
        bootstrapTenants,
        setActiveTenantId,
    } = useAuthContext();

    const [isLoading, setIsLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newTenantName, setNewTenantName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            setIsLoading(true);
            setError('');
            try {
                const tenantList = await bootstrapTenants();

                if (tenantList.length === 1) {
                    setActiveTenantId(tenantList[0]._id);
                    navigate('/devices');
                    return;
                }

                if (activeTenantId && tenantList.some((tenant) => tenant._id === activeTenantId)) {
                    navigate('/devices');
                }
            } catch (err) {
                setError(err.message || 'Failed to load tenants.');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [isLoggedIn]);

    const handleSelectTenant = (tenantId) => {
        setActiveTenantId(tenantId);
        navigate('/devices');
    };

    const handleCreateTenant = async () => {
        if (!newTenantName.trim()) {
            setError('Tenant name is required.');
            return;
        }

        setCreating(true);
        setError('');
        try {
            const response = await tenantApi.create({ name: newTenantName.trim() });
            const tenant = response?.data || response;
            await bootstrapTenants();
            setActiveTenantId(tenant._id);
            navigate('/devices');
        } catch (err) {
            setError(err.message || 'Failed to create tenant.');
        } finally {
            setCreating(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'grey.100' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'grey.100', p: 2 }}>
            <Paper sx={{ width: '100%', maxWidth: 560, p: 3, borderRadius: 3 }} elevation={3}>
                <Stack spacing={2.5}>
                    <Typography variant="h5" fontWeight={700}>
                        Select Tenant
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Choose the tenant context for this session.
                    </Typography>

                    {!!error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}

                    {tenants.length > 0 ? (
                        <Stack spacing={1}>
                            {tenants.map((tenant) => (
                                <Button
                                    key={tenant._id}
                                    variant="outlined"
                                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    onClick={() => handleSelectTenant(tenant._id)}
                                >
                                    {tenant.name}
                                </Button>
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No tenant found. Create your first tenant to continue.
                        </Typography>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="New tenant name"
                            value={newTenantName}
                            onChange={(event) => setNewTenantName(event.target.value)}
                            disabled={creating}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateTenant}
                            disabled={creating}
                            sx={{ minWidth: 140, textTransform: 'none' }}
                        >
                            {creating ? 'Creating...' : 'Create Tenant'}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
