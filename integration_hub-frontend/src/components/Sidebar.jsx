import React, { useContext } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Toolbar,
} from "@mui/material";

const Sidebar = () => {
  const { open, toggleOpen } = useContext(SidebarContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { label: "Devices", icon: <DashboardIcon />, path: "/devices" },
    { label: "Users", icon: <PeopleIcon />, path: "/users" },
    { label: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
    { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
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
        <Toolbar/> {/* Spacer to align with Navbar */}
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
