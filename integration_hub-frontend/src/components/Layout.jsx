import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { SidebarProvider } from "../context/SidebarContext";
import { Toolbar, Box } from "@mui/material";

const Layout = () => {
  return (
    <SidebarProvider>
      <Box>
        <Navbar />
        <Toolbar /> {/* Spacer to push content below the fixed Navbar */}
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Outlet />
        </Box>
      </Box>
    </SidebarProvider>
  );
};

export default Layout;
