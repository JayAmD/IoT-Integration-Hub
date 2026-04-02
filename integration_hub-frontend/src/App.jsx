import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Layout from "./components/layout/Layout.jsx";
import Devices from "./routes/Devices.jsx";
import DeviceDetail from "./routes/DeviceDetail.jsx";
import Messages from "./routes/Messages.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import SignupPage from "./routes/SignupPage.jsx";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/devices" element={<Devices />} />
                <Route path="/devices/:deviceId" element={<DeviceDetail />} />
                <Route path="/messages" element={<Messages />} />
                {/* <Route path="/groups" element={<Groups />} /> */}

                <Route path={"/"} element={<Navigate to={"/devices"} replace />} />
                <Route path={"*"} element={<header>Page Not Found</header>} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Box>
  );
}

export default App;
