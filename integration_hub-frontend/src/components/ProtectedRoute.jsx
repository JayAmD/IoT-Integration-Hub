import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ requireTenant = true }) => {
    const { isLoggedIn, activeTenantId } = useAuthContext();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (requireTenant && !activeTenantId) {
        return <Navigate to="/tenant-selector" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;