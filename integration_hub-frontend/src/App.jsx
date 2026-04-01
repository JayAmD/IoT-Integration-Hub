import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "./components/layout/Layout.jsx";

import Devices from "./routes/Devices.jsx";
import DeviceDetail from "./routes/DeviceDetail.jsx";
import Messages from "./routes/Messages.jsx";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/:deviceId" element={<DeviceDetail />} />
            <Route path="/messages" element={<Messages />} />
            {/* <Route path="/groups" element={<Groups />} /> */}
            <Route path={"/"} element={<Navigate to={"/devices"} replace />} />
            <Route path={"*"} element={<header>Page Not Found</header>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
