import React, { useContext } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from '@mui/icons-material/Business';
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Toolbar,
} from "@mui/material";

const Sidebar = () => {
  const { open, toggleOpen } = useContext(SidebarContext);
  const { activeTenantId } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { label: "Devices", icon: <DashboardIcon />, path: `/tenants/${activeTenantId}/devices` },
    { label: "Groups", icon: <GroupsIcon />, path: `/tenants/${activeTenantId}/groups` },
    { label: "Tenants", icon: <BusinessIcon />, path: "/tenants" },
    { label: "Analytics", icon: <AnalyticsIcon />, path: `/tenants/${activeTenantId}/analytics` },
    { label: "Settings", icon: <SettingsIcon />, path: `/tenants/${activeTenantId}/settings` },
  ];

  const handleNavigate = (path) => {
    // If the path is tenant-specific but we have no tenantId, redirect to selector
    if (path.includes('undefined') || path.startsWith('/null/')) {
      navigate('/tenants');
    } else {
      navigate(path);
    }

    if (isMobile) toggleOpen();
  };

  return (
    <Drawer
      anchor="left"
      open={isMobile ? open : true}
      onClose={toggleOpen}
      variant={isMobile ? "temporary" : "permanent"}
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar /> {/* Spacer to align with Header */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
