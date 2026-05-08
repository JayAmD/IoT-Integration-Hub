import React, { useEffect } from 'react';
import { Navigate, Outlet, useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Box, Typography, Button, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ProtectedRoute = ({ requireTenant = true }) => {
    const { isLoggedIn, activeTenantId, setActiveTenantId, tenants } = useAuthContext();
    const { tenantId: urlTenantId } = useParams();

    // 1. Sync URL tenantId to context
    useEffect(() => {
        if (urlTenantId && urlTenantId !== activeTenantId) {
            // Check if this tenant is actually available to the user
            const isValid = tenants.length === 0 || tenants.some(t => t._id === urlTenantId);
            if (isValid) {
                setActiveTenantId(urlTenantId);
            }
        }
    }, [urlTenantId, activeTenantId, setActiveTenantId, tenants]);

    // 2. Auth check
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 3. Tenant check (if required)
    if (requireTenant) {
        // If no tenant in URL, or invalid tenant ID
        const isValid = tenants.length === 0 || tenants.some(t => t._id === urlTenantId);
        
        if (!urlTenantId || (tenants.length > 0 && !isValid)) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '80vh',
                    p: 3 
                }}>
                    <Paper elevation={0} sx={{ 
                        p: 5, 
                        textAlign: 'center', 
                        borderRadius: 4, 
                        border: '1px solid',
                        borderColor: 'divider',
                        maxWidth: 450
                    }}>
                        <WarningAmberIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Tenant Access Denied
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            The tenant you are looking for does not exist or you do not have permission to access it.
                        </Typography>
                        <Button 
                            component={Link} 
                            to="/tenants" 
                            variant="contained" 
                            size="large"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Return to Tenant Selector
                        </Button>
                    </Paper>
                </Box>
            );
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;