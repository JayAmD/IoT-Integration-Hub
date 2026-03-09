import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Layout from "./components/Layout.jsx";

import Devices from "./routes/Devices.jsx";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/devices" element={<Devices />} />
            {/* <Route path="/messages" element={<Messages />} /> */}
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
