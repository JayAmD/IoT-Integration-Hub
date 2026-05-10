import React, { useContext } from "react";
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

import RouterIcon from "@mui/icons-material/Router";
import SchemaIcon from "@mui/icons-material/Schema";
import HubIcon from "@mui/icons-material/Hub";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import MessageIcon from "@mui/icons-material/Message";
import BusinessIcon from '@mui/icons-material/Business';

const Sidebar = () => {
  const { open, toggleOpen } = useContext(SidebarContext);
  const { activeTenantId } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { label: "Tenants", icon: <BusinessIcon />, path: "/tenants" },
    { label: "Devices", icon: <RouterIcon />, path: `/tenants/${activeTenantId}/devices` },
    { label: "Groups", icon: <SchemaIcon />, path: `/tenants/${activeTenantId}/groups` },
    { label: "Messages", icon: <MessageIcon />, path: `/tenants/${activeTenantId}/messages` },
    { label: "Endpoints", icon: <HubIcon />, path: `/tenants/${activeTenantId}/endpoints` },
    { label: "Credentials", icon: <VpnKeyIcon />, path: `/tenants/${activeTenantId}/credentials` },
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
