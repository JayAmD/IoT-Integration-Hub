import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton } from '@mui/material';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from "@mui/icons-material/Close";
import { SidebarContext } from '../context/SidebarContext';

const Navbar = () => {
    const { open, toggleOpen } = useContext(SidebarContext);

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                        color="inherit"
                        edge="start"
                        onClick={toggleOpen}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        {open ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>

                <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                     <DeviceHubOutlinedIcon />
                     <Typography variant='h6' sx={{display:{xs:"none", sm:"inline"}}}>IoT Integration Hub</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" href="/login">
                        Log In
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        href="/signup"
                    >
                        Sign Up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;