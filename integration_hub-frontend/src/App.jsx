import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider, useAuthContext } from "./context/AuthContext.jsx";
import { GroupProvider } from "./context/GroupContext.jsx";
import { MessageProvider } from "./context/MessageContext.jsx";
import { TenantProvider } from "./context/TenantContext.jsx";
import { CredentialProvider } from "./context/CredentialContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Layout from "./components/layout/Layout.jsx";
import Devices from "./routes/Devices.jsx";
import DeviceDetail from "./routes/DeviceDetail.jsx";
import Messages from "./routes/Messages.jsx";
import Groups from "./routes/Groups.jsx";
import Credentials from "./routes/Credentials.jsx";
import Tenants from "./routes/Tenants.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import SignupPage from "./routes/SignupPage.jsx";

// Component to handle root redirect based on auth/tenant state
const RootRedirect = () => {
  const { isLoggedIn, activeTenantId, tenants } = useAuthContext();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const targetId = activeTenantId || (tenants.length > 0 ? tenants[0]._id : null);

  if (targetId) return <Navigate to={`/tenants/${targetId}/devices`} replace />;
  return <Navigate to="/tenants" replace />;
};

function App() {
  return (
    <Box>
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <CredentialProvider>
              <MessageProvider>
                <GroupProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Root Path Handler */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Global Management — auth required, no tenant context in URL */}
                    <Route element={<ProtectedRoute requireTenant={false} />}>
                      <Route element={<Layout />}>
                        <Route path="/tenants" element={<Tenants />} />
                      </Route>
                    </Route>

                    {/* Tenant-Specific Routes — /tenants/:tenantId/... */}
                    <Route path="/tenants/:tenantId" element={<ProtectedRoute requireTenant />}>
                      <Route element={<Layout />}>
                        <Route index element={<Navigate to="devices" replace />} />
                        <Route path="devices" element={<Devices />} />
                        <Route path="devices/:deviceId" element={<DeviceDetail />} />
                        <Route path="messages" element={<Messages />} />
                        <Route path="credentials" element={<Credentials />} />
                        <Route path="groups" element={<Groups />} />
                      </Route>
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Box sx={{ p: 4 }}><header>Page Not Found</header></Box>} />
                  </Routes>
                </GroupProvider>
              </MessageProvider>
            </CredentialProvider>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
    </Box>
  );
}

export default App;
