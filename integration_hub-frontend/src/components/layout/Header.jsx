import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Avatar, Tooltip } from '@mui/material';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Chip } from '@mui/material';
import { SidebarContext } from '../../context/SidebarContext.jsx';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { open, toggleOpen } = useContext(SidebarContext);
    const { isLoggedIn, logout, activeTenant } = useAuthContext();
    const navigate = useNavigate();

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

                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <DeviceHubOutlinedIcon />
                        <Typography variant='h6' sx={{ display: { xs: "none", md: "inline" }, fontWeight: 'bold' }}>IoT Integration Hub</Typography>
                    </Box>

                    {activeTenant && (
                        <Chip
                            icon={<BusinessIcon sx={{ color: '#ffffff !important', fontSize: '1.1rem' }} />}
                            label={"Active Tenant: " + activeTenant.name}
                            variant="filled"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.25)',
                                color: '#ffffff',
                                fontWeight: 700,
                                px: 0.5,
                                height: 28,
                                fontSize: '0.85rem',
                                display: { xs: 'none', sm: 'flex' },
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '& .MuiChip-label': {
                                    paddingLeft: '8px',
                                    paddingRight: '12px',
                                }
                            }}
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {isLoggedIn ? (
                        <>
                            <Tooltip title="User Profile">
                                <IconButton color="inherit">
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Button color="inherit" onClick={logout}>
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Log In
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/signup')}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;