import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

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

    if (requireTenant && !activeTenantId) {
        return <Navigate to="/tenants" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;