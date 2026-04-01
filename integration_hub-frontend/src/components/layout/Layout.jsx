import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { SidebarProvider } from "../../context/SidebarContext.jsx";
import { Toolbar, Box } from "@mui/material";

const Layout = () => {
  return (
    <SidebarProvider>
      <Box>
        <Header />
        <Toolbar /> {/* Spacer to push content below the fixed Header */}
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Outlet />
        </Box>
      </Box>
    </SidebarProvider>
  );
};

export default Layout;
